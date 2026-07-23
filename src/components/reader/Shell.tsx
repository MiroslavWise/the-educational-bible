import type { ReactNode } from "react"
import { HStack } from "@astryxdesign/core/Layout"

interface ShellProps {
  children: ReactNode
}

/** App frame shared by every page: sticky top bar. Color mode follows OS via CSS. */
export function Shell({ children }: ShellProps) {
  return (
    <div className="tb-app">
      <header className="tb-topbar">
        <HStack hAlign="between" vAlign="center" paddingInline={5} paddingBlock={3} gap={3}>
          <a className="tb-brand" href="/">
            📖 Женевская учебная Библия
          </a>
        </HStack>
      </header>
      <main>{children}</main>
    </div>
  )
}
