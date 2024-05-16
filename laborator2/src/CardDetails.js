import React from 'react';
import { useParams } from 'react-router-dom';

const CardDetails = ({ store }) => {
    const { id } = useParams();
    const selectedCard = store.items.find((item) => item.key === id);

    return (
        <div>
            {selectedCard && (
                <div>
                    <h2>Detalii Card</h2>
                    <p>Detinator: {selectedCard.NameOfOwner}</p>
                    <p>Număr card: {selectedCard.NrCard}</p>
                    <p>Data de expirare: {selectedCard.DateOfExpire}</p>
                    <p>CVC: {selectedCard.CVC}</p>
                    <p>Culoare: {selectedCard.color}</p>
                    <p>Bank: {selectedCard.bank}</p>
                    {}
                </div>
            )}
        </div>
    );
};

export default CardDetails;