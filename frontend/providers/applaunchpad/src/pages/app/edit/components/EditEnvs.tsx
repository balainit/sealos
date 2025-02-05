import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';

const EditEnvs = ({
  defaultVal,
  successCb,
  onClose
}: {
  defaultVal: string;
  successCb: (e: { key: string; value: string }[]) => void;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const [inputVal, setInputVal] = useState(defaultVal);

  const onSubmit = useCallback(() => {
    const lines = inputVal.split('\n').filter((item) => item);
    const result = lines
      .map((str) => {
        // replace special symbol
        str = str.trim();
        if (/^-\s*/.test(str)) {
          str = str.replace(/^-\s*/, '');
        }
        if (str.includes('=')) {
          const i = str.indexOf('=');
          return [str.slice(0, i), str.slice(i + 1)];
        } else if (str.includes(':')) {
          const i = str.indexOf(':');
          return [str.slice(0, i), str.slice(i + 1)];
        }
        return '';
      })
      .filter((item) => item)
      .map((item) => {
        // remove quotation
        const key = item[0].replace(/^['"]|['"]$/g, '').trim();
        const value = item[1].replace(/^['"]|['"]$/g, '').trim();

        return {
          key,
          value
        };
      });
    successCb(result);
    onClose();
  }, [inputVal, onClose, successCb]);

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxH={'90vh'} maxW={'90vw'} minW={'600px'} w={'auto'}>
        <ModalHeader>{t('Edit Env Variable')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            h={'350px'}
            maxH={'100%'}
            value={inputVal}
            resize={'both'}
            bg={'myWhite.300'}
            placeholder={t('Env Placeholder') || ''}
            overflowX={'auto'}
            whiteSpace={inputVal === '' ? 'pre' : 'nowrap'}
            onChange={(e) => setInputVal(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button w={'110px'} variant={'primary'} onClick={onSubmit}>
            {t('Confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditEnvs;
