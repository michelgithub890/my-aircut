'use client'

export default function Home() {
  const _handleMap = () => {
    // window.open(profil[0].map, "_blank")
    window.open("https://maps.app.goo.gl/Xu1uEKg3HP6XgNi97", "_blank")
  }

  const _handlePhone = () => {
      // const phoneUrl = `tel:${profil[0].phone}`
      const phoneUrl = `tel:7359841296`
      try {
          window.location.href = phoneUrl
      } catch {
          console.log('impossible')
      }  
  }
  return (
    <div className="bg-emerald-100">
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div className="flex justify-center">
        <button onClick={_handleMap}>map</button>
      </div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div className="flex justify-center">
        <button onClick={_handlePhone}>phone</button>
      </div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home my-aircut</div>
      <div>home -aircut</div>
      <div>home my-aircut</div>
    </div>
  )
}
