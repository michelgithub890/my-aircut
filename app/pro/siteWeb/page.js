import React from 'react'
// COMPONENTS 
import HeaderPro from '@/components/pro/HeaderPro'
// NEXT 
import Image from 'next/image'
// IMAGES 
import imageQRCode from '@/public/assets/images/qrcode.png' 

const SiteWeb = () => {
    return (
        <div>
            <HeaderPro title="QR CODE" />

            <div className="flex justify-center mt-10">
                <Image
                    src={imageQRCode}
                    width={500}
                    height={500}
                    alt="qrcode"
                />
            </div>
        </div>
    )
}

export default SiteWeb
