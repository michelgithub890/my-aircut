import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ModalBookingSelected = ({ handleClose, open, handleConfirm, bookSelected, _handleConfirmBooking, _handleDeleteBooking, confirmBooking }) => {
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
                    <div className="text-center mt-8">{`${bookSelected && bookSelected.dateString} à ${bookSelected && bookSelected.timeString}`}</div>
                    <div className="text-center mt-3">{`${bookSelected && bookSelected.service}`}</div>
                    <div className="text-center mt-3">{`${bookSelected && bookSelected.duration}min - ${bookSelected && bookSelected.price}€`}</div>
                    <div className="text-center mt-3">{`${bookSelected && bookSelected.duration}min - ${bookSelected && bookSelected.price}€`}</div>
                    <div className="text-center mt-3">{`avec ${bookSelected && bookSelected.staffSurname}`}</div>
                    <div className="text-center mt-3">{`client: ${bookSelected && bookSelected.authName}`}</div>
                    <div className="text-center mt-3">{`email: ${bookSelected && bookSelected.authEmail}`}</div> 
                    <div className="flex justify-center mt-5">
                        {confirmBooking ? 
                            <button className="myButtonRed" onClick={() => _handleDeleteBooking(bookSelected.id)}>Confirmer</button>
                        : 
                            <button className="myButtonRed" onClick={_handleConfirmBooking}>Supprimer</button>
                        }
                    </div>
            </DialogContent>
        </Dialog>
    );
};

export default ModalBookingSelected;
