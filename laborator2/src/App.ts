interface CardInfo {
    key: string;
    NrCard: string;
    NumberOfCard: string;
    DateOfExpire: string;
    NameOfOwner: string;
    CVC: string;
}


interface ExtendedCardInfo extends CardInfo {
    color: string;
    bank: string;
}

export { CardInfo, ExtendedCardInfo };