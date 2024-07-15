// src/app/@modal/(.)signIn/page.tsx
import React from 'react'
import { Modal, ModalBody, ModalContent, ModalFooter } from '~/components/animated-modal'

export default function signInModal() {
  return (
      <Modal>
        <ModalBody className="text-red-500">
          <ModalContent>
            Teste
          </ModalContent>

          <ModalFooter>
            Footer
          </ModalFooter>

        </ModalBody>

      </Modal>
  )
}
