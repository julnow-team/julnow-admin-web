import { useEffect, useRef } from 'react'

// Opens and closes a native <dialog> from the `open` flag, for Dialog and Drawer.
// Put ref and handlers on the <dialog>. Esc and a click on the backdrop call onClose,
// and the parent decides if it really closes (it can refuse while saving).
// The browser gives focus back to the button that opened the dialog.
export function useModal(open, onClose) {
  const ref = useRef(null)
  const pressedBackdrop = useRef(false)
  const opener = useRef(null)

  useEffect(() => {
    const dialog = ref.current

    if (open && !dialog.open) {
      opener.current = document.activeElement
      dialog.showModal()
    }

    if (!open && dialog.open) {
      dialog.close()
      // The browser also does this, but it fails when two dialogs close at the same time
      // (a confirm dialog on top of a drawer). Then focus would be lost, so we check on the next frame.
      const button = opener.current
      requestAnimationFrame(() => {
        if (button?.isConnected && document.activeElement === document.body) button.focus()
      })
    }
  }, [open])

  return {
    ref,
    // Esc inside a Select or another widget is handled there first, it calls preventDefault
    onKeyDown(event) {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        onClose()
      }
    },
    // The browser can still fire "cancel" (for example on Android back), keep the dialog open until the parent says so
    onCancel(event) {
      event.preventDefault()
      onClose()
    },
    // The backdrop is the dialog element itself. Only close when the press started there too,
    // so selecting text inside and letting go outside does not close it.
    onMouseDown(event) {
      pressedBackdrop.current = event.target === ref.current
    },
    onClick(event) {
      if (event.target === ref.current && pressedBackdrop.current) onClose()
    },
  }
}
