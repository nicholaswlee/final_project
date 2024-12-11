import React from 'react'
import { Box, Modal as MUIModal} from '@mui/material'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: "#ffffff",
    borderRadius: 8,
    boxShadow: 24,
    p: 4,
  };

function Modal({children, isOpen, onClose}) {
    return (
        <MUIModal
        style={{ backgroundColor: "rgba(0, 0, 0, 0.25)", zIndex: 1 }}
        open={isOpen}
        onClose={onClose}>
            <Box sx={style}>
                {children}
            </Box>
        </MUIModal>
    )
}

export default Modal