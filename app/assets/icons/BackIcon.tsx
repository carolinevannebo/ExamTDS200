import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

const BackIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 12H2m0 0L12 2M2 12l10 10"
    />
  </Svg>
)
export default BackIcon;
