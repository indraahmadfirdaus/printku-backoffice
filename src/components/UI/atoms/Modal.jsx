import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  closable = true,
  className = ''
}) => {
  const sizeClasses = {
    xs: 'max-w-xs w-full mx-4',
    sm: 'max-w-lg w-full mx-4',
    md: 'max-w-xl w-full mx-4',
    lg: 'max-w-3xl w-full mx-4',
    xl: 'max-w-5xl w-full mx-4',
    full: 'max-w-7xl w-full mx-4'
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closable ? onClose : () => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all ${className}`}>
                {title && (
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-base-content">
                      {title}
                    </Dialog.Title>
                    {closable && (
                      <button
                        type="button"
                        className="text-base-content/60 hover:text-base-content transition-colors flex-shrink-0 ml-4"
                        onClick={onClose}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal