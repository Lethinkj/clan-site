import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`bg-slate-900/95 border border-cyan-400/30 rounded-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col animate-fade-in`}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-cyan-400/20">
            <h3 className="text-xl font-bold text-cyan-400">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-cyan-400 text-2xl leading-none transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// Confirm Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const typeStyles = {
    danger: 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30'
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-slate-900/95 border border-cyan-400/30 rounded-lg max-w-sm w-full p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-cyan-400 mb-3">{title}</h3>
        <p className="text-aura mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-500/20 border border-gray-500/50 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Alert/Toast Component
interface AlertProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
}

export function Alert({ isOpen, onClose, title, message, type = 'info' }: AlertProps) {
  if (!isOpen) return null

  const typeStyles = {
    success: { bg: 'bg-green-500/10 border-green-500/30', icon: '✓', color: 'text-green-400' },
    error: { bg: 'bg-red-500/10 border-red-500/30', icon: '✕', color: 'text-red-400' },
    warning: { bg: 'bg-yellow-500/10 border-yellow-500/30', icon: '⚠', color: 'text-yellow-400' },
    info: { bg: 'bg-blue-500/10 border-blue-500/30', icon: 'ℹ', color: 'text-blue-400' }
  }

  const style = typeStyles[type]

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className={`${style.bg} border rounded-lg max-w-sm w-full p-6 animate-fade-in`}>
        <div className="text-center">
          <div className={`text-5xl mb-4 ${style.color}`}>{style.icon}</div>
          <h3 className={`text-xl font-bold mb-2 ${style.color}`}>{title}</h3>
          <p className="text-aura mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-400 text-slate-900 font-bold rounded-lg hover:bg-cyan-500 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
