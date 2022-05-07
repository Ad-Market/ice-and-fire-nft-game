import React, { useCallback, useEffect } from 'react'
import { CaptionCard, CaptionCardHeader, CaptionsContainer, CaptionText, HomeButton } from '../../components';
import { getContract } from '../../utils/contractUtils';
import { attackPlayer } from '../../utils/fighter.actions';

function Arena({ player1, player2, setPlayer1, setPlayer2 }) {

    const attackOtherPlayer = async (attacker, defender,) => {
        attackPlayer(attacker, defender, () => { })
    }

    const attackListenerCallback = useCallback(
        async () => {
            const onAttackComplete = (defenderTokenId, defenderHealthPoints) => {
                if (player1.tokenId === defenderTokenId.toNumber()) {
                    setPlayer1(prev => ({ ...prev, healthPoints: defenderHealthPoints.toNumber() }));
                }
                if (player2.tokenId === defenderTokenId.toNumber()) {
                    setPlayer1(prev => ({ ...prev, healthPoints: defenderHealthPoints.toNumber() }));
                }
            }
            const iceFireContract = await getContract();
            iceFireContract.on("AttackComplete", onAttackComplete);

            return () => {
                iceFireContract.off("AttackComplete", onAttackComplete);
            }
        },
        // eslint-disable-next-line
        [],
    );

    useEffect(() => {
        attackListenerCallback()
        // eslint-disable-next-line
    }, []);

    return (
        <CaptionsContainer >
            <CaptionCard className='arena' >
                <img src={player1.image} alt={`${player1.name} face`} width="100%" height="100%" />
                <CaptionCardHeader >
                    {`${player1.name} of House ${player1.house}`}
                </CaptionCardHeader>
                <CaptionText className="stat" >Health: {player1.healthPoints}</CaptionText>
                <CaptionText className="stat" >Attack: {player1.attackDamage}</CaptionText>
                <HomeButton onClick={() => {
                    attackOtherPlayer(player1.tokenId, player2.tokenId);
                }}>
                    Hit {player2.name}
                </HomeButton>
            </CaptionCard>
            <CaptionCard className='arena' >
                <img src={player2.image} alt={`${player2.name} face`} width="100%" height="100%" />
                <CaptionCardHeader >
                    {`${player2.name} of House ${player2.house}`}
                </CaptionCardHeader>
                <CaptionText className="stat" >Health: {player2.healthPoints}</CaptionText>
                <CaptionText className="stat" >Attack: {player2.attackDamage}</CaptionText>
                <HomeButton onClick={() => {
                    attackOtherPlayer(player2.tokenId, player1.tokenId);
                }}>
                    Hit {player1.name}
                </HomeButton>
            </CaptionCard>
        </CaptionsContainer>
    )
}

export default Arena;