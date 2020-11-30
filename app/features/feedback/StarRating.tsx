import React, { useState } from 'react';
import { Box, Flex } from 'rebass';
import { colors } from '../../theme';
import { IoStar, IoStarOutline } from 'react-icons/io5';

export default function StarRating(props: {onClick: (rating: number) => void, rating?: number}) {
  const [selectedNumber, setSelectedNumber] = useState(props.rating || 0)
  const [mouseIsOver, setMouseIsOver] = useState(false)
  let els = []
  const mouseOver = setSelectedNumber
  for(let i = 1; i <= 5; i++) {
    let selected = i <= selectedNumber
    let el =
      <Box
        style={{
          width: 20,
          cursor: "pointer",
          color: mouseIsOver ? colors.bright : colors.primary
        }}
        pt={2}
        key={i}
        onMouseOver={() => { setMouseIsOver(true); mouseOver(i) }}
        onClick={() => props.onClick(i)}
      >
        {selected ? <IoStar /> : <IoStarOutline />}
      </Box>
    els.push(el)
  }
  return <Flex flexDirection={'row'} onMouseLeave={() => { setMouseIsOver(false); setSelectedNumber(props.rating || 0)}}>
    {els}
  </Flex>
}
