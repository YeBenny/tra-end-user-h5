import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { useConfigStore } from '../stores/config'

axios.defaults.withCredentials = true

axios.interceptors.request.use(
  (config) => {
    config.headers['X-Wegalaxy-Request-Id'] = uuidv4()
    config.headers['X-Tra-Transaction-Id'] = uuidv4()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (res) => {
    const data = res.data
    if (res.status === 200) {
      let errorCode = data.errorCode ?? data.errcode
      let errorMessage = data.errorMessage ?? data.errmsg
      if (errorCode === 0) {
        let result = data.data
        return Promise.resolve(result)
      } else {
        return Promise.reject(errorMessage)
      }
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

const getHeaders = (appId, signature, timestamp, functionName) => {
  let headers = {}
  let { config } = useConfigStore()
  let token = config.webTraAccessToken
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (appId) {
    headers['appId'] = appId
  }
  if (signature) {
    headers['signature'] = signature
  }
  if (timestamp) {
    headers['timestamp'] = timestamp
  }
  if (functionName) {
    headers['functionName'] = functionName
  }
  return headers
}

function getToken(upstreamUserId, appId, signature, timestamp) {
  let { config } = useConfigStore()
  const functionName = 'getToken'
  return axios.post(
    `${config.webTraBaseUrl}/users/get-token`,
    {
      upstreamUserId: upstreamUserId
    },
    {
      headers: getHeaders(appId, signature, timestamp, functionName)
    }
  )
}

function getSeriesList(startIndex, pageSize) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/list`,
    {
      pageInfo: {
        startIndex: startIndex,
        pageSize: pageSize
      }
    },
    {
      headers: getHeaders()
    }
  )
}

function getSeriesDetail(id) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/get`,
    {
      id: id
    },
    {
      headers: getHeaders()
    }
  )
}

function getTraList(seriesId) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/tras/list`,
    {
      seriesId: seriesId
    },
    {
      headers: getHeaders()
    }
  )
}

function getTraDetail(id) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/tras/get`,
    {
      id: id
    },
    {
      headers: getHeaders()
    }
  )
}

function getRedemptionList(seriesId) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/redemptions/list`,
    {
      seriesId: seriesId
    },
    {
      headers: getHeaders()
    }
  )
}

function redeemTRA(redemptionRuleId, redeemItems) {
  let { config } = useConfigStore()
  return axios.post(
    `${config.webTraBaseUrl}/apps/series/redemptions/do`,
    {
      redemptionRuleId: redemptionRuleId,
      redeemItems: redeemItems
    },
    {
      headers: getHeaders()
    }
  )
}

export {
  getToken,
  getSeriesList,
  getSeriesDetail,
  getTraList,
  getTraDetail,
  getRedemptionList,
  redeemTRA
}
