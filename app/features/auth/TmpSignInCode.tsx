import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectTmpSignInCode,
  setAccessToken,
  setTmpSignInCode
} from './authSlice';
import { Box, Flex, Text } from 'rebass';
import ByplayAPIClient from '../../backend/ByplayAPIClient';
import ActivityIndicator from '../../utils/ActivityIndicator';
import { colors } from '../../theme';
import Preferences from '../../Preferences';

function CountIndicator(props: {count: number}) {
  const scale = 10
  const rotation = 45
  const width = 120
  return <Flex mt={2} flexDirection={"row"}>
    <Box  pt={2} style={{width, position: "relative"}}>
      <Text fontSize={10} color={"muted"} fontFamily={"monospace"} width={width} textAlign={"center"}>
        waiting
      </Text>
      <Box mt={3} style={{
        position: "absolute",
        top: -2,
        left: 0,
        transition: "all 0.5s ease-in-out",
        height: 2,
        width: scale,
        transform: `rotate(${props.count * rotation}deg)`
      }} bg={"muted"}>
      </Box>
      <Box mt={3} style={{
        position: "absolute",
        top: -2,
        right: 0,
        transition: "all 0.5s ease-in-out",
        height: 2,
        width: scale,
        transform: `rotate(-${props.count * rotation}deg)`
      }} bg={"muted"}>
      </Box>
    </Box>
  </Flex>
}

export default function TmpSignInCode() {
  const dispatch = useDispatch()
  const [count, setCount] = useState(0)

  const tmpSignInCode = useSelector(selectTmpSignInCode)
  console.log("tmpSignInCode: ", tmpSignInCode)

  useEffect(() => {
    if(!tmpSignInCode || !tmpSignInCode.code) {
      ByplayAPIClient.instance.authCreateTmpSignInCode().then(
        (tsc) => dispatch(
          setTmpSignInCode({
            code: tsc.response?.tmp_sign_in_code!,
            checkToken: tsc.response?.check_token!
          })
        )
      )
    }
  }, [])

  const rememberToken = (token: string) => {
    dispatch(setAccessToken(token))
    new Preferences().set("accessToken", token)
  }

  useEffect(() => {
    async function checkTmpCode() {
      console.warn("checking tmp code", tmpSignInCode)
      if(!tmpSignInCode || !tmpSignInCode.checkToken) {
        return
      }
      let res = await ByplayAPIClient.instance.authCheckTmpSignInCode(tmpSignInCode.checkToken)
      setCount(count + 1)
      if(res.success && res.response.activated) {
        rememberToken(res.response.access_token)
      }
    }
    let interval = setInterval(checkTmpCode, 2000)
    return () => clearInterval(interval)
  })

  console.log(tmpSignInCode)
  return <Flex flexDirection={"row"} mt={4}>
    <Box width={500} mr={100}>
      <Box fontSize={1}>
        <Text py={1}>1. Open Byplay Camera on your device</Text>
        <Text py={1}>2. Go to Gallery by tapping button on bottom right</Text>
        <Text py={1}>3. Tap "Activate Byplay desktop"</Text>
        <Text py={1}>4. Enter the code:</Text>
      </Box>
      <Box mt={3} width={120}>
        <Text
          fontFamily={"monospace"}
          textAlign={"center"}
          fontWeight={"light"}
          fontSize={4}
          style={{border: `1px solid ${colors.textMuted}`, borderRadius: 5}}
        >
          {tmpSignInCode ? tmpSignInCode.code : <ActivityIndicator />}
        </Text>
        <CountIndicator count={count} />
      </Box>
    </Box>
    <Box width={400}>
      <video autoPlay loop muted width={200}>
        <source src={"https://storage.googleapis.com/byplay-website/standalone/tmpsignincodedemo.mov"}/>
      </video>
    </Box>
  </Flex>
}
