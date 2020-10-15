import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from 'rebass';
import { selectTmpSignInCode, setAccessToken, setTmpSignInCode } from '../auth/authSlice';
import ByplayAPIClient from '../../backend/ByplayAPIClient';

export default function TmpSignInCode() {
  const dispatch = useDispatch()
  const [count, setCount] = useState(0)

  const tmpSignInCode = useSelector(selectTmpSignInCode)
  console.log("tmpSignInCode: ", tmpSignInCode)

  useEffect(() => {
    if(!tmpSignInCode) {
      console.warn("Requesting tmpSignInCode")
      ByplayAPIClient.instance.authCreateTmpSignInCode().then(resp => dispatch(
        setTmpSignInCode({
          code: resp.response!.tmp_sign_in_code!,
          checkToken: resp.response!.check_token!,
        })
      ))
    }
  }, [])

  useEffect(() => {
    async function checkTmpCode() {
      console.warn("checking tmp code", tmpSignInCode)
      if(!tmpSignInCode) {
        return
      }
      setCount(count + 1)
      let res = await ByplayAPIClient.instance.authCheckTmpSignInCode(
        tmpSignInCode.checkToken
      )
      if(res.success) {
        if(res.response.activated) {
          dispatch(setAccessToken(res.response.access_token))
        }
      }
    }
    let interval = setInterval(checkTmpCode, 1000)
    return () => clearInterval(interval)
  }, [tmpSignInCode])

  return <Box width={1/2} px={2}>
    <Text p={1} color='background' bg='primary'>
      {tmpSignInCode ? tmpSignInCode.code : "...."}
    </Text>
    <Text p={1} color='background' bg='primary'>
      {count}
    </Text>
  </Box>
}
