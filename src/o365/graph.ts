import { Client } from '@microsoft/microsoft-graph-client'
import { AuthorizationCode } from 'simple-oauth2'

import User from '../model/system/User'
import DatabaseService from '../service/DatabaseService'

import 'isomorphic-fetch'

export async function graph_getUserDetails(accessToken) {
  const client: Client = graph_getAuthenticatedClient(accessToken)
  return await client.api('/me').get()
}

export async function graph_getContacts(accessToken) {
  const client: Client = graph_getAuthenticatedClient(accessToken)
  const url = '/me/contacts?$top=500'

  try {
    return await graph_getContactsRecursive(client, url, [])
  } catch (exc) {
    console.error(exc.message)
  }
}
async function graph_getContactsRecursive(
  client: Client,
  url: string,
  arr: []
) {
  const data = await client.api(url).get()
  const newArr = arr.concat(data.value) as []

  if (data['@odata.nextLink']) {
    return graph_getContactsRecursive(client, data['@odata.nextLink'], newArr)
  } else {
    return newArr
  }
}

export async function graph_saveContact(
  contact: IO365Contact,
  accessToken: string,
  onError: (message: string) => void
) {
  const client: Client = graph_getAuthenticatedClient(accessToken)
  try {
    return await client.api(`/me/contacts`).post(contact)
  } catch (exc) {
    onError(exc.message)
  }
}

export async function graph_deleteContact(
  id: string,
  accessToken: string,
  onError: (message: string) => void
) {
  const client: Client = graph_getAuthenticatedClient(accessToken)
  try {
    return await client.api(`/me/contacts/${id}`).delete()
  } catch (exc) {
    onError(exc.message)
  }
}

export function graph_getAuthenticatedClient(accessToken): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken)
    },
  })
}

export async function graph_getAccessToken(req) {
  if (req.user) {
    const storedToken = req.user.oauthToken
    if (storedToken) {
      if (storedToken.expired()) {
        const newToken = await storedToken.refresh()
        req.user.oauthToken = newToken
        return newToken.token.access_token
      }
      return storedToken.token.access_token
    }
  }
}

export function graph_getOAuth() {
  return new AuthorizationCode({
    client: {
      id: process.env.OAUTH_CLIENT_ID,
      secret: process.env.OAUTH_CLIENT_SECRET,
    },
    auth: {
      tokenHost: 'https://login.microsoftonline.com/common/',
      authorizePath: 'oauth2/v2.0/authorize',
      tokenPath: 'oauth2/v2.0/token',
    },
  })
}

let user: User
let users: Map<string, any>
export async function graph_setUserForO365(u: User, us: Map<string, any>) {
  user = u
  users = us
}

export async function graph_signInComplete(
  iss,
  sub,
  profile,
  accessToken,
  refreshToken,
  params,
  done
) {
  if (!profile.oid) {
    return done(new Error('No OID found in user profile.'))
  }

  try {
    const user = await graph_getUserDetails(accessToken)
    if (user) {
      profile.email = user.mail ? user.mail : user.userPrincipalName
    }
  } catch (exc) {
    return done(exc)
  }

  user.o365_oauth_token = JSON.stringify(params)
  user.o365_oaccess_token = accessToken

  await DatabaseService.insert('data', [user])

  let oauthToken = graph_getOAuth().createToken(params)

  users.set(profile.oid, { profile, oauthToken })

  return done(null, users[profile.oid])
}
