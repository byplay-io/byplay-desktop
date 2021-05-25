import Modal, { Styles } from 'react-modal';
import React, { useEffect, useState } from 'react';
import { colors } from '../../theme';
import { Box, Button, Flex } from 'rebass';
import RecordingLocalManager from '../../backend/RecordingLocalManager';
import { useStore } from 'react-redux';
import { IByplayAPIResponseRecordingFile } from '../../types/byplayAPI';
import ActivityIndicator from '../../utils/ActivityIndicator';

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
    borderColor: colors.secondaryMuted,
    maxHeight: "80%"
  },
  overlay: {
    backgroundColor: colors.primaryBgTransparent
  }
};

enum FileToDownloadStatus {
  DOES_NOT_EXIST,
  EXISTS,
  DOWNLOADING,
  DOWNLOADED,
}

function RedownloadFile(props: {file: IByplayAPIResponseRecordingFile, manager: RecordingLocalManager}) {
  let [status, setStatus] = useState<FileToDownloadStatus>(FileToDownloadStatus.DOES_NOT_EXIST)

  useEffect(() => {
    if(props.manager.doesExist(props.file.path)) {
      setStatus(FileToDownloadStatus.EXISTS)
    }
  }, [props.file.path])

  const doDownload = async () => {
    setStatus(FileToDownloadStatus.DOWNLOADING)
    await props.manager.dowloadFile(props.file.path, props.file.link)
    setStatus(FileToDownloadStatus.DOWNLOADED)
  }

  return <Flex flexDirection={"row"} p={2} height={50}>
    <Box width={400}>
      <span>
        {props.file.path}
      </span>
    </Box>
    <Box width={140}>
      {status == FileToDownloadStatus.DOES_NOT_EXIST ? <Button onClick={doDownload}>download</Button> : null}
      {status == FileToDownloadStatus.EXISTS ? <Button variant={'outline'} onClick={doDownload}>re-download</Button> : null}
      {status == FileToDownloadStatus.DOWNLOADED ? <Box color={'successMuted'}>Downloaded</Box> : null}
      {status == FileToDownloadStatus.DOWNLOADING ? <ActivityIndicator /> : null}
    </Box>
  </Flex>
}

export default function RedownloadRecordingModal(props: {
  recordingId: string,
  onClose: () => void
}) {
  let [filesList, setFilesList] = useState<IByplayAPIResponseRecordingFile[]>([])

  let store = useStore()
  let m = new RecordingLocalManager(props.recordingId, store)

  useEffect(() => {
    if(props.recordingId == null)
      return

    m.getRedownloadFileList().then((files) => {
      setFilesList(files.filter(({path}) => !path.endsWith(".mp4")))
    })
  }, [props.recordingId])

  return <Modal
    isOpen={props.recordingId != null}
    // onAfterOpen={afterOpenModal}
    onRequestClose={props.onClose}
    style={customStyles}
    contentLabel="Sending feedback"
  >
    <Box>
      <Box style={{textAlign: "center"}}>
        <h3 style={{marginTop: 0, paddingTop: 0}}>re-download files for {props.recordingId}</h3>
      </Box>
      <Box>
        {filesList.length == 0 ? <ActivityIndicator /> : null}
        {filesList.map((f) => <RedownloadFile key={f.path} file={f} manager={m} />)}
      </Box>
    </Box>
  </Modal>
}
