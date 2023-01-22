import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FlexColumn from '../../Layout/FlexColumn';
import FlexRow from '../../Layout/FlexRow';
import { setCurrentTier } from '../store/mintSlice';
import { formatCountdown, getCurrentTier } from '../store/mintSliceHelpers';

function MintContractRender() {

  const dispatch = useDispatch();

  const collectionData = useSelector(state => state.mintInfo.collectionData);
  const minted = useSelector(state => state.mintInfo.minted);
  const [totalSupply, setTotalSupply] = useState(0);
  useEffect(() => {
    if (Object.keys(collectionData).length === 0) {
      return;
    }

    // console.log(collectionData);
    let totalSupply = collectionData['total-supply']['int'];
    setTotalSupply(totalSupply);
  }, [collectionData]);


  const currentTier = useSelector(state => state.mintInfo.currentTier);
  const [timerStatus, setTimerStatus] = useState('before');
  
  const [tierName, setTierName] = useState('');
  const [endTime, setEndTime] = useState(new Date());
  const [priceText, setPriceText] = useState('');
  useEffect(() => {
    // console.log(collectionData);
    if (Object.keys(currentTier).length === 0) {
      // console.log('no collection data'); 
      return;
    }
    let tierId = currentTier['tier-id'];
    setTierName(tierId);

    if (currentTier.cost < 0) {
      setPriceText('-');
    }
    else if (currentTier.cost === 0) {
      setPriceText('Free');
    }
    else {
      setPriceText(`${currentTier.cost} $KDA`);
    }

    if (currentTier.cost < 0) {
      setTimerStatus('before');
    }
    else if (currentTier['end-time']['time'] !== currentTier['start-time']['time']) {
      setTimerStatus('during');
    }
    else {
      setTimerStatus('final');
    }
    
    setEndTime(new Date(currentTier['end-time']['time']));
  }, [currentTier]);


  var timer
  const [countdown, setCountdown] = useState({});
  useEffect(() => {
    // console.log('tier has end', tierHasEnd);
    console.log(timerStatus);
    if (timerStatus === 'final') {
      clearInterval(timer);
    }
    else {
      timer = setInterval(() => { 
        let countdownData = formatCountdown(endTime)
        setCountdown(countdownData);
        if (new Date() > endTime) {
          dispatch(setCurrentTier(getCurrentTier(collectionData.tiers)));
        }
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    }
  }, [timerStatus]);

  return (
    <FlexColumn className='gap-10'>
      <h1 className='text-7xl text-center'>{tierName}</h1>
      {timerStatus !== 'final' ? 
        <FlexColumn className="flex-1 text-center">
          <p className='text-3xl'>{timerStatus === 'before' ? 'Mint Starts In' : 'Time Remaining'}</p>
          <FlexRow className='gap-4 justify-center'> 
            <FlexColumn className='w-32'>
              <h1 className='flex-auto text-white text-7xl font-extrabold'>{countdown.hours}</h1>
              <p className='text-xl'>Hours</p>
            </FlexColumn>
            <FlexColumn className='w-32'>
              <h1 className='flex-auto text-white text-7xl font-extrabold'>{countdown.minutes}</h1>
              <p className='text-xl'>Minutes</p>
            </FlexColumn>
            <FlexColumn className='w-32'>
              <h1 className='flex-auto text-white text-7xl font-extrabold'>{countdown.seconds}</h1>
              <p className='text-xl'>Seconds</p>
            </FlexColumn>
          </FlexRow>
        </FlexColumn> :
        <></>}
      <FlexRow className="w-full gap-10 text-center">
        <FlexColumn className="flex-auto w-64 gap-4">
          <h1 className='text-white text-7xl font-extrabold'>{priceText}</h1>
          <p className='text-xl'>Current Price</p>
        </FlexColumn>
        <FlexColumn className="flex-auto w-64 gap-4">
          <h1 className='text-white text-7xl font-extrabold'>{minted} / {totalSupply}</h1>
          <p className='text-xl'>Tikis Minted</p>
        </FlexColumn>
      </FlexRow>
    </FlexColumn>
  )
}

export default MintContractRender;
