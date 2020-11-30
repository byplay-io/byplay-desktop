import React, { useEffect, useState } from 'react';
import Modal, { Styles } from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  IFeedbackExtraData,
  selectFeedbackExtra,
  selectFeedbackOpen,
  setFeedbackClosed,
  setFeedbackOpen,
  setFeedbackRating
} from './feedbackSlice';
import { colors } from '../../theme';
import { Box, Button, Flex, Text } from 'rebass';
import { Label, Textarea } from '@rebass/forms';
import { error } from 'electron-log';
import ByplayAPIClient from '../../backend/ByplayAPIClient';
import ActivityIndicator from '../../utils/ActivityIndicator';
import { Analytics, AnalyticsUserEventType } from '../../backend/Amplitude';
import StarRating from './StarRating';

Modal.setAppElement('#root')

const customStyles: Styles = {
  content: {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor: colors.secondaryBg,
    borderColor: colors.secondaryMuted
  },
  overlay: {
    backgroundColor: colors.primaryBgTransparent
  }
};

function RatingRow(props: {ratingKey: keyof IFeedbackExtraData, title: string}) {
  const extraData = useSelector(selectFeedbackExtra)
  if(extraData == null) {
    return null
  }
  const rating = ((extraData as IFeedbackExtraData)[props.ratingKey] || 0) as number

  const dispatch = useDispatch()
  const setRating = (rating: number) => {
    dispatch(setFeedbackRating([props.ratingKey, rating]))
  }

  return <Flex flexDirection={"row"}>
    <Box style={{width: 200, textAlign: 'right'}}>
      <Text color={colors.textMuted} pt={2} pr={2}>
        {props.title}
      </Text>
    </Box>
    <Box pb={2}>
      <StarRating rating={rating} onClick={setRating} />
    </Box>
  </Flex>
}

function RecordingRating() {
  const extraData = useSelector(selectFeedbackExtra)
  if(!extraData?.recordingId) {
    return null
  }

  return <Box>
    <Text pb={2}>Recording id: <b>{extraData.recordingId}</b></Text>
    <RatingRow ratingKey={"rating"} title={"Overall"} />
    <RatingRow ratingKey={"videoRating"} title={"Video quality"}  />
    <RatingRow ratingKey={"trackingRating"} title={"Tracking quality"}  />
    <RatingRow ratingKey={"sceneRating"} title={"Generated scene quality"}  />
  </Box>
}

export default function FeedbackModal() {
  const isOpen = useSelector(selectFeedbackOpen)
  const extraData = useSelector(selectFeedbackExtra)
  const [isLoading, setIsLoading] = useState(false)
  const [sentSuccessfully, setSentSuccessfully] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    if(isOpen) {
      Analytics.registerUserEvent(AnalyticsUserEventType.FEEDBACK_MODAL_OPEN, extraData)
    } else {
      Analytics.registerUserEvent(AnalyticsUserEventType.FEEDBACK_MODAL_CLOSED, extraData)
    }
    setFeedbackText("")
    setSentSuccessfully(false)
    setIsLoading(false)
  }, [isOpen])

  const openModal = () => dispatch(setFeedbackOpen(null))
  const closeModal = () => {
    dispatch(setFeedbackClosed())
  }

  const sendFeedback = async () => {
    if(feedbackText.length < 3 && extraData == null) {
      alert("Please enter something")
      return
    }
    Analytics.registerUserEvent(
      AnalyticsUserEventType.FEEDBACK_MODAL_SENT,
      {
        feedbackText,
        extraData
      }
    )
    try {
      setIsLoading(true)
      await ByplayAPIClient.instance.sendFeedback(feedbackText, extraData || {})
      setIsLoading(false)
      setSentSuccessfully(true)
    } catch (e) {
      alert("Sorry we couldn't send feedback. Try again or send us an email at hello@byplay.io")
      error("Couldt send feedback")
      error(e)
    }
  }

  return (
    <div style={{position: "fixed", bottom: 10, right: 10}}>
      <Button onClick={openModal}>Feedback?</Button>
      <Modal
        isOpen={isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Sending feedback"
      >
        {!sentSuccessfully ?
          <Box>
            <Box style={{textAlign: "center"}}>
              <h3 style={{marginTop: 0, paddingTop: 0}}>Send feedback</h3>
            </Box>
            <RecordingRating />
            <Box>
              <Label htmlFor='email'>Message</Label>
              <Textarea
                style={{width: 400, height: 100}}
                onChange={event => setFeedbackText(event.target.value)}
                value={feedbackText}
                disabled={isLoading}
                placeholder={extraData?.recordingId ? "Video quality is ok, tracking is lost around frame XX" : "XXX isn't working or should be improved"}
              />
              <Flex flexWrap={"nowrap"} flexDirection={"row"} mt={2}>
                <Button variant={"outline"} onClick={closeModal} disabled={isLoading}>
                  Cancel
                </Button>
                <Box flex={"auto"}></Box>
                {isLoading ?
                  <ActivityIndicator /> :
                  <Button onClick={sendFeedback}>Send</Button> }
              </Flex>
            </Box>
          </Box>
          : <Box style={{width: 200, textAlign: 'center'}}>
            <h4 style={{color: colors.success}}>Got it, thanks!</h4>
            <Button mt={2} variant={"outline"} onClick={closeModal} disabled={isLoading}>
              Okay
            </Button>
          </Box> }
      </Modal>
    </div>
  );
}
