import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

const ModalAddBooking = ({ 
    handleClose, 
    open, 
    services, 
    lists, 
    _handleAddBooking, 
    serviceSelected, 
    _handleSelectBooking, 
    _handleCancelBooking, 
    staffSelected 
}) => {
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
                    <div className="text-center mt-8">Ajouter un service</div>
                    <div className="text-center mb-3">avec {staffSelected?.staffSurname}</div>

                    {serviceSelected ? 
                        <>
                            <div>{serviceSelected}</div>
                            {services?.filter(service => service.id === serviceSelected).map((service, serviceIndex) => (
                                <div key={serviceIndex}>
                                    <div>{service.name}</div>
                                    <div>{service.duration}min - {service.price}€</div>
                                </div>
                            ))}

                            <div className="flex justify-center mt-5 gap-4">
                                <button className="myButtonRed" onClick={_handleCancelBooking}>Annuler</button>
                                <button className="myButtonGrey" onClick={_handleAddBooking}>Enregistrer</button>
                            </div>

                        </>
                    : 
                        <>
                            {lists?.sort((a,b) => a.name.localeCompare(b.name)).map(list => (
                                <div key={list.id}>
                                    <div className="bg-slate-300 p-2">{list.name}</div>
                                    {services?.sort((a,b) => a.name.localeCompare(b.name)).map(service => (
                                        <div 
                                            key={service.id} 
                                            className="p-2" 
                                            style={{ cursor:"pointer" }}
                                            onClick={() => _handleSelectBooking(service)}
                                        >{service.name}</div>
                                    ))}
                                </div>
                            ))}
                        </>
                    }

                    <div style={{ height:200 }} />

            </DialogContent>
        </Dialog>
    )
}

export default ModalAddBooking
