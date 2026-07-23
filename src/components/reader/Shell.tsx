import type { ReactNode } from "react"
import { Theme } from "@astryxdesign/core/theme"
import { neutralTheme } from "@astryxdesign/theme-neutral"
import { HStack } from "@astryxdesign/core/Layout"
import { Button } from "@astryxdesign/core/Button"
import { useColorMode } from "./useColorMode"

interface ShellProps {
  children: ReactNode
}

/** App frame shared by every page: theme provider + sticky top bar. */
export function Shell({ children }: ShellProps) {
  const { mode, toggle } = useColorMode()

  return (
    <Theme theme={neutralTheme} mode={mode}>
      <div className="tb-app">
        <header className="tb-topbar">
          <HStack hAlign="between" vAlign="center" paddingInline={5} paddingBlock={3} gap={3}>
            <a className="tb-brand" href="/">
              📖 Женевская учебная Библия
            </a>
            <Button label={mode === "dark" ? "Светлая тема" : "Тёмная тема"} variant="ghost" size="sm" onClick={toggle} />
          </HStack>
        </header>
        <main>{children}</main>
      </div>
    </Theme>
  )
}
