import { useCallback, useRef, useState } from 'react'
import { collectDroppedFiles } from '../lib/files'

/**
 * Window-wide drag & drop. Returns the dragging flag + handlers to spread on
 * a wrapping element. Supports multiple files AND dropped folders.
 */
export function useFileDrop(onFiles) {
  const [isDragging, setIsDragging] = useState(false)
  const depth = useRef(0) // dragenter/leave fire for every child element

  const onDragEnter = useCallback((e) => {
    if (!e.dataTransfer?.types?.includes('Files')) return
    e.preventDefault()
    depth.current += 1
    setIsDragging(true)
  }, [])

  const onDragOver = useCallback((e) => {
    if (e.dataTransfer?.types?.includes('Files')) e.preventDefault()
  }, [])

  const onDragLeave = useCallback(() => {
    depth.current = Math.max(0, depth.current - 1)
    if (depth.current === 0) setIsDragging(false)
  }, [])

  const onDrop = useCallback(
    async (e) => {
      e.preventDefault()
      depth.current = 0
      setIsDragging(false)
      const files = await collectDroppedFiles(e.dataTransfer)
      if (files.length) onFiles(files)
    },
    [onFiles],
  )

  return { isDragging, dropProps: { onDragEnter, onDragOver, onDragLeave, onDrop } }
}
