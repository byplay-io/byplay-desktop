import React, { ReactNode } from 'react';
import { Flex, Text, Box, Heading } from 'rebass';

export function PageContent(props: {title: string, children: ReactNode}) {
  return <Flex flexDirection={"column"}>
    <Box p={2}>
      <Heading
        fontSize={4}
        textAlign={"center"}
        fontFamily={"monospace"}
        color='secondary'>
        {props.title}
      </Heading>
    </Box>
    <Box p={2}>
      {props.children}
    </Box>
  </Flex>
}
