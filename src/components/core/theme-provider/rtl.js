'use client'

import * as React from 'react'

export function Rtl({ children, direction = 'ltr' }) {
  React.useEffect(() => {
    document.dir = direction
  }, [direction])

  return <React.Fragment>{children}</React.Fragment>
}
