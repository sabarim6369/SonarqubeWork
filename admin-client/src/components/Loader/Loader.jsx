import { Mosaic } from 'react-loading-indicators'

export default function Loader() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                zIndex: "100000",
                position:"absolute"
            }}
        >
            <Mosaic color="#4635B1" size="large" text="" textColor="" />
        </div>
    )
}
