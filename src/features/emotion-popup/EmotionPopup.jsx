import { useTranslation } from 'react-i18next';
import { useState, Fragment, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import set from 'lodash/set';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
} from 'firebase/firestore';
import {
  Button,
  Autocomplete,
  Textarea,
  Modal,
  ModalClose,
  ModalDialog,
  Typography, Box,
} from '@mui/joy';
import { instanceSelector } from '../firebase/firebaseSlice.js';
import { userinfoSelector } from '../auth/authSlice.js';

const emotionsList = [
  'happy',
  'sad',
  'angry',
  'fear',
  'disgust',
  'surprise',
];

const causesList = [
  'family',
  'friends',
  'work',
];

const getDraftSchema = () => ({
  emotion: '',
  cause: [],
  description: '',
});

function EmotionPopup({ activator, record, onSave }) {
  const { t } = useTranslation();

  const userinfo = useSelector(userinfoSelector);
  const instance = useSelector(instanceSelector);

  const db = getFirestore(instance);

  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useImmer(getDraftSchema());

  useEffect(() => {
    if (record) setDraft(record);
    else setDraft(getDraftSchema());
  }, [open]);

  function setToDraft({ path, value }) {
    return setDraft((draft) => set(draft, path, value));
  }

  async function submit() {
    if (record) {
      await setDoc(doc(db, 'emotions', record.id), draft);
    } else {
      const newRecord = {
        ...draft,
        createdAt: Date.now(),
        uid: userinfo.uid,
      };
      await addDoc(collection(db, 'emotions'), newRecord);
    }
    setOpen(false);
    return onSave && onSave();
  }

  return (
    <Fragment>
      <Box
        onClick={() => setOpen(true)}
      >
        {activator}
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <ModalDialog
          color="neutral"
          layout="fullscreen"
        >
          <ModalClose />
          <form className="p-4 w-6/12 bg-slate-300">
            <Typography level="h1">
              {t('emotions.title')}
            </Typography>
            <Autocomplete
              value={draft.emotion}
              options={emotionsList}
              placeholder={t('emotions.emotion')}
              onChange={(e, value) => setToDraft({ value, path: 'emotion' })}
            ></Autocomplete>
            <Autocomplete
              value={draft.cause}
              options={causesList}
              placeholder={t('emotions.cause')}
              onChange={(e, value) => setToDraft({ value, path: 'cause' })}
              multiple
            ></Autocomplete>
            <Textarea
              value={draft.description}
              placeholder={t('emotions.description')}
              onChange={(e) => setToDraft({ value: e.target.value, path: 'description' })}
              minRows={3}
            ></Textarea>
            <Button
              onClick={submit}
            >{t('reusable.submit')}
            </Button>
          </form>
        </ModalDialog>
      </Modal>
    </Fragment>
  );
}

EmotionPopup.propTypes = {
  activator: PropTypes.element.isRequired,
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    emotion: PropTypes.string.isRequired,
    cause: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }),
  onSave: PropTypes.func,
}

export default EmotionPopup;
