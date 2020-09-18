import React from 'react'

const Buss = (props: Props): JSX.Element => {
    const isLong = Boolean(props.route.length > 2)
    return (
        <svg
            width={isLong ? '60px' : '49px'}
            height="24px"
            viewBox="0 0 49 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <title>Group 2</title>
            <g
                id="Kart"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <g
                    id="avgang-i-kart"
                    transform="translate(-833.000000, -468.000000)"
                >
                    <g
                        id="Group-2"
                        transform="translate(833.000000, 468.000000)"
                    >
                        <rect
                            id="Rectangle-Copy-8"
                            fill="#C5044E"
                            x="0"
                            y="0"
                            width="49"
                            height="24"
                            rx="2"
                        ></rect>
                        <g
                            id="icon/tram-copy-9"
                            transform="translate(5.000000, 2.000000)"
                            fill="#FFFFFF"
                        >
                            <path
                                d="M2.07025,8.4868625 C2.07025,8.2393625 2.26775,8.0393625 2.50775,8.0393625 L3.384,8.0393625 C3.62525,8.0393625 3.819,8.2393625 3.819,8.4868625 L3.819,10.2768625 C3.819,10.5231125 3.62525,10.7243625 3.384,10.7243625 L2.50775,10.7243625 C2.26775,10.7243625 2.07025,10.5231125 2.07025,10.2768625 L2.07025,8.4868625 Z M4.69525,8.4868625 C4.69525,8.2393625 4.8915,8.0393625 5.13275,8.0393625 L8.63275,8.0393625 C8.874,8.0393625 9.0715,8.2393625 9.0715,8.4868625 L9.0715,10.2768625 C9.0715,10.5231125 8.874,10.7243625 8.63275,10.7243625 L5.13275,10.7243625 C4.8915,10.7243625 4.69525,10.5231125 4.69525,10.2768625 L4.69525,8.4868625 Z M9.94525,8.4868625 C9.94525,8.2393625 10.1415,8.0393625 10.38275,8.0393625 L13.88275,8.0393625 C14.124,8.0393625 14.32025,8.2393625 14.32025,8.4868625 L14.32025,10.2768625 C14.32025,10.5231125 14.124,10.7243625 13.88275,10.7243625 L10.38275,10.7243625 C10.1415,10.7243625 9.94525,10.5231125 9.94525,10.2768625 L9.94525,8.4868625 Z M15.19525,8.4868625 C15.19525,8.2393625 15.39275,8.0393625 15.63275,8.0393625 L16.9915,8.0393625 C17.21275,8.0393625 17.39775,8.2056125 17.424,8.4293625 L17.6565,10.2181125 C17.67275,10.3468625 17.634,10.4743625 17.55025,10.5718625 C17.46775,10.6693625 17.34775,10.7243625 17.22275,10.7243625 L15.63275,10.7243625 C15.39275,10.7243625 15.19525,10.5231125 15.19525,10.2768625 L15.19525,8.4868625 Z M5.687875,13.4997375 C6.377875,13.4997375 6.937875,14.0609875 6.937875,14.7497375 C6.937875,15.4397375 6.377875,15.9997375 5.687875,15.9997375 C4.997875,15.9997375 4.437875,15.4397375 4.437875,14.7497375 C4.437875,14.0609875 4.997875,13.4997375 5.687875,13.4997375 Z M14.375,13.4997375 C15.065,13.4997375 15.625,14.0609875 15.625,14.7497375 C15.625,15.4397375 15.065,15.9997375 14.375,15.9997375 C13.685,15.9997375 13.125,15.4397375 13.125,14.7497375 C13.125,14.0609875 13.685,13.4997375 14.375,13.4997375 Z M17.43775,6.2493625 C17.65275,6.2493625 17.83275,6.4081125 17.87025,6.6231125 L17.87025,6.6231125 L18.744,11.9931125 C18.74775,12.0181125 18.75025,12.0418625 18.75025,12.0668625 L18.75025,12.0668625 L18.75025,13.3018625 C18.75025,13.5481125 18.554,13.7493625 18.31275,13.7493625 L18.31275,13.7493625 L16.504,13.7493625 C16.209,12.8518625 15.3715,12.2493625 14.37525,12.2493625 C13.37775,12.2493625 12.54025,12.8518625 12.2465,13.7493625 L12.2465,13.7493625 L7.8165,13.7493625 C7.5215,12.8518625 6.68525,12.2493625 5.68775,12.2493625 C4.6915,12.2493625 3.854,12.8518625 3.559,13.7493625 L3.559,13.7493625 L1.62525,13.7493625 C1.41025,13.7493625 1.25025,13.5256125 1.25025,13.3018625 L1.25025,13.3018625 L1.25025,7.1456125 C1.25025,6.6968625 1.6865,6.2493625 2.12525,6.2493625 L2.12525,6.2493625 Z"
                                id="Icon-Fill"
                            ></path>
                            <text
                                x="22"
                                y="15"
                                fill="#FFFFFF"
                                fontFamily="nationale"
                                fontSize="14px"
                                fontWeight="regular"
                            >
                                {props.route}
                            </text>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}

interface Props {
    route: string
}

export default Buss
