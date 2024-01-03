import React, { useState, useContext, useEffect } from 'react'
// NAVIGATION
import { useNavigate, useParams } from 'react-router-dom'
// IMAGES
import imageCalendar from '../../../images/calendargif.gif'
import imageHoraires from '../../../images/horaires.png'
import imageServices from '../../../images/service.png'
import imageMap from '../../../images/map.png'
import imagePhone from '../../../images/phone.png'
import imageMail from '../../../images/email.png' 
import imageFacebook from '../../../images/facebook.png'
import imageTwitter from '../../../images/twitter.png'
import imageInstagram from '../../../images/instagram.png'
import imageChat from '../../../images/chat.png' 
import imageChatGif from '../../../images/chatgif.gif'
import imageProfil from '../../../images/imageprofil.png'

// CONTEXT 
import { AppContext } from '../../../App'
import PhoneComponent from '../../phone/PhoneComponent'

const HomeUserButton = ({ profil, messagesChat, _handlePhone, isPhone }) => {
    // const [keyUid, setKeyUid] = useState(localStorage.getItem('keyUid'))
    // const [tokenUser, setTokenUser] = useState(localStorage.getItem('tokenUser'))
    let navigate = useNavigate()
    const { user } = useContext(AppContext)


    return (
        <div className='ms-1 me-1'>

            {profil.filter(p => p.id === 'profil').map(p => (
                <div key={p.id}>

                    {/* CARD CALENDAR */}
                    <div className='mt-3' onClick={() => navigate('/bookingUsersPage')}>
                        <div className='card-body bg-white shadow rounded-2 py-3'>
                            <div className='text-center'>
                                <img src={imageCalendar} className='img-fluid' alt='image calendar' style={{ height:50, width:50 }} />
                                <div className='text-center' style={{fontSize:12}}>PRENDRE RDV</div>
                            </div>
                        </div> 
                    </div>

                    {/* AFFICHAGE HORAIRES SERVICES */} 
                    <div className='row text-center mt-4'>

                        {/* BOUTTON HORAIRES */}
                        <div className='col-6' onClick={() => navigate('/horairesUsersPage')}>
                            <div className='bg-white shadow rounded-2 py-3' style={{ marginRight:-3}}>
                                <div className='text-center'>
                                    <img src={imageHoraires} className='img-fluid' alt='image horaires' style={{ height:50, width:50 }} />
                                    <div className='text-center' style={{fontSize:12}}>HORAIRES</div>
                                </div>
                            </div>
                        </div>

                        {/* BOUTTON SERVICES */}
                        <div className='col-6' onClick={() => navigate('/bookingUsersPage')}>
                            <div className='bg-white shadow rounded-2 py-3' style={{ marginLeft:-3}}>
                                <div className='text-center'>
                                    <img src={imageServices} className='img-fluid' alt='image services' style={{ height:50, width:50 }} />
                                    <div className='text-center' style={{fontSize:12}}>SERVICES</div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* AFFICHAGE SITUER MESSAGES */}
                    <div className='row text-center mt-4'>

                        {/* BOUTTON NOUS SITUER */} 
                        <div className='col-6'>
                            <a
                                style={{textDecoration:'none', color:'black'}}
                                target="_blank"
                                href={p.googleMap}
                            >
                                <div className='bg-white shadow rounded-2 py-3' style={{ marginRight:-3}}>
                                    <div className='text-center'>
                                        <img src={imageMap} className='img-fluid' alt='image map' style={{ height:50, width:50 }} />
                                        <div className='text-center' style={{fontSize:12}}>NOUS SITUER</div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        {/* BOUTTON MESSAGES */}
                        <div className='col-6' onClick={() => navigate('/chatUsersPage')}>
                            <div className='bg-white shadow rounded-2 py-3' style={{ marginLeft:-3}}>
                                <div className='text-center'>
                                            {/* TEST IS NEW CHAT*/}
                                        {messagesChat
                                            .filter(mes => mes.uidClient === user.uid && mes.receiver === 'client' && mes.isNew)
                                            .map(mes => mes.id).length != 0 ? 
                                                <img src={imageChatGif} className='img-fluid' alt='image message' style={{ height:50, width:50 }} />
                                            : 
                                                <img src={imageChat} className='img-fluid' alt='image message' style={{ height:50, width:50 }} />
                                            }
                                    
                                    <div className='text-center' style={{fontSize:12}}>CHAT</div>
                                </div>
                            </div>
                        </div>

                    </div>
            
                    {/* SHOW PHONE MAIL */}
                    <div className='row text-center mt-4'>

                        <div className='col-3' />

                        {/* BOUTTON APPELER */}
                        <div className='col-6' onClick={_handlePhone}>
                            <div className='bg-white shadow rounded-2 py-3' style={{ marginRight:-3}}>
                                <div className='text-center'>
                                    <img src={imagePhone} className='img-fluid' alt='image phone' style={{ height:50, width:50 }} />
                                    <div className='text-center' style={{fontSize:12}}>APPELER</div>
                                </div> 
                            </div>
                        </div>
                        {isPhone && <PhoneComponent numberPhone={p.telephoneSalon} />}  

                        <div className='col-3' />

                        {/* BOUTTON MAIL */}
                        {/* <div className='col-6'>
                            <a href={"mailto:"+p.email} style={{textAlign:'center', color:'black', textDecoration:'none'}}>
                                <div className='bg-white shadow rounded-2 py-3' style={{ marginLeft:-3}}>
                                    <div className='text-center'>
                                        <img src={imageMail} className='img-fluid' alt='image mail' style={{ height:50, width:50 }} />
                                        <div className='text-center' style={{fontSize:12}}>EMAIL</div>
                                    </div>
                                </div>
                            </a>
                        </div>  */}
 
                    </div>

                    {/* BOUTTON PROFIL */}
                    {user.uid &&
                        <div className='row text-center m-4'>
                            <div className='col-3' />
                            <div className='col-6' onClick={() => navigate('/profilUserPage')}>
                                <div className='bg-white shadow rounded-2 py-3' style={{ marginLeft:-3}}>
                                    <div className='text-center'>
                                        <img src={imageProfil} className='img-fluid' alt='profil' style={{ height:50, width:50 }} />
                                        <div className='text-center' style={{fontSize:12}}>PROFIL</div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3' />
                        </div>
                    }

                    {/* FACEBOOK INSTAGRAM TWITTER */}
                    <div className='row mt-3 ms-1 me-1'>
                        {p.facebook &&  
                            <div className='col-4'>
                                <a
                                    style={{textDecoration:'none', color:'black'}}
                                    target="_blank"
                                    href={p.facebook}
                                >
                                    <div className='bg-white shadow rounded-2 py-3' style={{ marginRight:-3, marginLeft:-3}}>
                                        <div className='text-center'>
                                            <img src={imageFacebook} className='img-fluid' alt='image facebook' style={{ height:30, width:30 }} />
                                        </div>
                                    </div>
                                </a>
                            </div>
                        }
                        {p.instagram && 
                            <div className='col-4'>
                                <a
                                    style={{textDecoration:'none', color:'black'}}
                                    target="_blank"
                                    href={p.instagram}
                                >
                                    <div className='bg-white shadow rounded-2 py-3' style={{ marginRight:-3, marginLeft:-3}}>
                                        <div className='text-center'>
                                            <img src={imageInstagram} className='img-fluid' alt='image instagram' style={{ height:30, width:30 }} />
                                        </div>
                                    </div>
                                </a>
                            </div>
                        }
                        {p.twitter && 
                            <div className='col-4'>
                                <a
                                    style={{textDecoration:'none', color:'black'}}
                                    target="_blank"
                                    href={p.twitter}
                                >
                                    <div className='bg-white shadow rounded-2 py-3' style={{ marginRight:-3, marginLeft:-3}}>
                                        <div className='text-center'>
                                            <img src={imageTwitter} className='img-fluid' alt='image twitter' style={{ height:30, width:30 }} />
                                        </div>
                                    </div>
                                </a>
                            </div>
                        }
                    </div>
                </div>
            ))}
            
        </div>
    )
}

export default HomeUserButton


