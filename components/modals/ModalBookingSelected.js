'use client'
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ModalBookingSelected = ({ handleClose, open, handleConfirm, title, bookSelected }) => {
    const [quart, setQuart] = useState()

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="xl"
            PaperProps={{
                style: { height: '100vh', position: 'relative' } // Ajoute position relative pour positionner la croix
            }}
        >
            <IconButton
                onClick={handleClose}
                style={{ position: 'absolute', right: 8, top: 8 }} // Positionne l'IconButton
            >
                <CloseIcon />
            </IconButton>

            <DialogContent>
                    <div className="text-center mt-3">{`${bookSelected && bookSelected.dateString} à ${bookSelected && bookSelected.timeString}`}</div>
                    <div className="text-center mt-3">{`${bookSelected && bookSelected.service}`}</div>
                    <div className="text-center mt-3">{`${bookSelected && bookSelected.duration}min - ${bookSelected && bookSelected.price}€`}</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Annuler</Button>
                <Button onClick={handleConfirm} autoFocus>Supprimer</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ModalBookingSelected;
