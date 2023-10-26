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
  Textarea,
  Modal,
  ModalClose,
  ModalDialog,
  Typography, Box,
} from '@mui/joy';
import { getApp } from 'firebase/app';
import { selectUserinfo } from '../../features/auth/authSlice.js';
import FeelingsAutocomplete
  from '../../features/feelings/FeelingsAutocomplete.jsx';
import CausesAutocomplete from '../../features/causes/CausesAutocomplete.jsx';

const getDraftSchema = () => ({
  feelings: [],
  causes: [],
  description: '',
});

function LogPopup({
                    activator,
                    record,
                    onSave,
                    onClose,
                    mode,
                  }) {
  const { t } = useTranslation();

  const userinfo = useSelector(selectUserinfo);

  const db = getFirestore(getApp());

  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useImmer(getDraftSchema());

  useEffect(() => {
    if (record) setDraft(record);
    else setDraft(getDraftSchema());
  }, [open, activator]);

  function setToDraft({ path, value }) {
    return setDraft((draft) => set(draft, path, value));
  }

  async function submit() {
    const feelingsRefs = draft.feelings.map((feeling) => doc(db, 'feelings', feeling.id));
    const causesRefs = draft.causes.map((cause) => doc(db, 'causes', cause.id));

    const newRecord = {
      // if exists, will be overwritten by ..draft
      createdAt: Date.now(),
      // if exists, will be overwritten by ..draft
      uid: userinfo.uid,
      ...draft,
      feelings: feelingsRefs,
      causes: causesRefs,
    };

    if (record) {
      delete newRecord.id;
      await setDoc(doc(db, 'logs', record.id), newRecord);
    } else {
      await addDoc(collection(db, 'logs'), newRecord);
    }
    setOpen(false);
    return onSave && onSave();
  }

  return (
    <Fragment>
      {
        // if activator is not a boolean, render it
        typeof activator !== 'boolean' &&
        <Box onClick={() => setOpen(true)}>
          {activator}
        </Box>
      }
      <Modal
        open={typeof activator === 'boolean' ? activator : open}
        onClose={() => typeof activator === 'boolean'
          ? onClose()
          : setOpen(false)}
      >
        <ModalDialog
          sx={{ width: '50vw' }}
          color="neutral"
        >
          <ModalClose />
          <Box component="form" sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
            <Typography level="h1">
              {t('feelings.title')}
            </Typography>
            <FeelingsAutocomplete
              value={draft.feelings}
              onChange={(e, value) => setToDraft({ value, path: 'feelings' })}
            ></FeelingsAutocomplete>
            <CausesAutocomplete
              value={draft.causes}
              onChange={(e, value) => setToDraft({ value, path: 'causes' })}
            ></CausesAutocomplete>
            <Textarea
              value={draft.description}
              placeholder={t('feelings.description')}
              onChange={(e) => setToDraft({
                value: e.target.value,
                path: 'description',
              })}
              minRows={3}
            ></Textarea>
            <Button
              onClick={submit}
            >{t('reusable.submit')}
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Fragment>
  );
}

LogPopup.propTypes = {
  activator: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.bool,
  ]).isRequired,
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    feelings: PropTypes.string.isRequired,
    causes: PropTypes.arrayOf(PropTypes.string).isRequired,
    description: PropTypes.string,
  }),
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  mode: PropTypes.string,
};

export default LogPopup;
