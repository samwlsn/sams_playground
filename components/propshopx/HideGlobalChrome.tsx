'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/lib/store/chatStore'

/** Hides existing playground chat/betslip/customizer overlays on PropShopX routes. */
export function HideGlobalChrome() {
  const setChatOpen = useChatStore((s) => s.setIsOpen)

  useEffect(() => {
    setChatOpen(false)
    document.documentElement.classList.remove('chat-open', 'dark')
    document.documentElement.classList.add('light')

    const style = document.createElement('style')
    style.setAttribute('data-propshopx-chrome', 'true')
    style.textContent = `
      html:has(.propshopx-root).chat-open,
      html:has(.propshopx-root).chat-open body {
        margin-right: 0 !important;
        padding-right: 0 !important;
        width: 100% !important;
      }
      html:has(.propshopx-root) #chat-portal-root,
      html:has(.propshopx-root) [data-design-customizer],
      html:has(.propshopx-root) button[aria-label="Open chat"],
      html:has(.propshopx-root) button[aria-label="Open betslip"],
      html:has(.propshopx-root) .fixed.bottom-4.right-4 {
        display: none !important;
        pointer-events: none !important;
      }
      html:has(.propshopx-root),
      body:has(.propshopx-root) {
        background: #F5F5F5 !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [setChatOpen])

  return null
}
