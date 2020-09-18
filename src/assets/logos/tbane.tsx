import React from 'react'

const Metro = (props: Props): JSX.Element => {
    return (
        <svg
            width="49px"
            height="24px"
            viewBox="0 0 49 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <title>Group 3</title>
            <g
                id="Kart"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
            >
                <g
                    id="Artboard"
                    transform="translate(-156.000000, -181.000000)"
                >
                    <g
                        id="Group-3"
                        transform="translate(156.000000, 181.000000)"
                    >
                        <rect
                            id="Rectangle-Copy-8"
                            fill="#DE8108"
                            x="0"
                            y="0"
                            width="49"
                            height="24"
                            rx="2"
                        ></rect>
                        <g
                            id="icon/tram-copy-4"
                            transform="translate(5.000000, 2.000000)"
                            fill="#FFFFFF"
                        >
                            <path
                                d="M9.999375,1.25 C14.825625,1.25 18.749375,5.17625 18.749375,10 C18.749375,14.82375 14.825625,18.75 9.999375,18.75 C5.174375,18.75 1.249375,14.82375 1.249375,10 C1.249375,5.17625 5.174375,1.25 9.999375,1.25 Z M9.999375,2.5 C5.864375,2.5 2.499375,5.86375 2.499375,10 C2.499375,14.13625 5.864375,17.5 9.999375,17.5 C14.135625,17.5 17.499375,14.13625 17.499375,10 C17.499375,5.86375 14.135625,2.5 9.999375,2.5 Z M13.748625,6.25 L13.748625,7.70875 L10.729875,7.70875 L10.729875,15 L9.271125,15 L9.271125,7.70875 L6.254875,7.70875 L6.254875,6.25 L13.748625,6.25 Z"
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

export default Metro
