import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const HomeIcon = (props: SvgProps) => (
    <Svg
        width={24}
        height={24}
        fill="none"
        {...props}>
            
    <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 22V12h6v10M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
    />
  </Svg>
)
export default HomeIcon
