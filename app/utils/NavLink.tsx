import { Link as RebassLink, LinkProps } from 'rebass';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link as RouterLink } from 'react-router-dom';
import React from 'react';

const NavLink = (props: {title: string, to: string, disabled?: boolean, ml?: number}) => {
  // @ts-ignore
  let prop: LinkProps = {to: props.to}
  let currentLocation = useSelector((state: RootState) => state.router.location)

  let isActive = currentLocation.pathname == props.to

  return <RebassLink
    sx={{
      display: 'inline-block',
      fontWeight: 'bold',
      py: 1,
      color: isActive ? 'highlight' : 'secondary',
      fontFamily: "monospace"
    }}
    as={RouterLink}
    disabled={props.disabled || isActive}
    {...prop}
    ml={props.ml}
  >
    {props.title}
  </RebassLink>
}

export default NavLink
