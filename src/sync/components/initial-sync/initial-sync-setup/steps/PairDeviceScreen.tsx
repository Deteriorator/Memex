import React from 'react'
import styled from 'styled-components'
import QRCanvas from 'src/common-ui/components/qr-canvas'
import {
    ModalBox,
    ModalColLeft,
    ModalColRight,
} from 'src/common-ui/components/design-library/ModalBox'
import { SecondaryAction } from 'src/common-ui/components/design-library/actions/SecondaryAction'
import { colorError } from 'src/common-ui/components/design-library/colors'
import LoadingIndicator from 'src/common-ui/components/LoadingIndicator'
import {
    TypographyHeadingPage,
    TypographyBodyBlock,
} from 'src/common-ui/components/design-library/typography'

const LeftColumnHelpText = () => (
    <ModalColLeft>
        <TypographyHeadingPage>STEP 2</TypographyHeadingPage>
        <TypographyBodyBlock>{helpText}</TypographyBodyBlock>
    </ModalColLeft>
)

export const LoadingQRCode = ({}) => (
    <ModalBox
        header={titleText}
        actions={[<SecondaryAction label={'back'} onClick={() => null} />]}
    >
        <LeftColumnHelpText />

        <ModalColRight>
            <QRPlaceHolder>
                <LoadingIndicator />
            </QRPlaceHolder>
        </ModalColRight>
    </ModalBox>
)

export const ScanQRCode = ({ QRCodeData }: { QRCodeData: string }) => (
    <ModalBox
        header={titleText}
        actions={[<SecondaryAction label={'back'} onClick={() => null} />]}
    >
        <LeftColumnHelpText />

        <ModalColRight>
            <QRPlaceHolder>
                <QRCanvas toEncode={QRCodeData} />
            </QRPlaceHolder>
        </ModalColRight>
    </ModalBox>
)

export const ErrorPane = ({}) => (
    <ModalBox
        header={titleText}
        actions={[<SecondaryAction label={'back'} onClick={() => null} />]}
    >
        <LeftColumnHelpText />

        <ModalColRight>
            <QRPlaceHolderError>Something went wrong</QRPlaceHolderError>
        </ModalColRight>
    </ModalBox>
)

export const PairDeviceScreen = ({
    initialSyncMessage,
}: {
    initialSyncMessage?: string
}) => {
    return initialSyncMessage ? (
        <ScanQRCode QRCodeData={initialSyncMessage} />
    ) : (
        <LoadingQRCode />
    )
}

const titleText = 'Pair your computer with a mobile device'
const helpText = 'Scan this QR code with your mobile app to pair the devices'
const QRPlaceHolder = styled.div`
    min-width: 150px;
    min-height: 150px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
`

const QRPlaceHolderError = styled(QRPlaceHolder)`
    border: 1px solid ${colorError};
`
