import React from 'react';
import EditEnvironmentModal from '../../../components/modals/EditEnvironmentModal';
import SaveAsModal from '../../../components/modals/SaveAsModal';
import ImportCurlModal from '../../../components/modals/ImportCurlModal';
import GenerateCodeModal from '../../../components/modals/GenerateCodeModal';

interface RestModalsProps {
  // Edit environment
  editModal: 'global' | 'environment' | null;
  setEditModal: (val: null) => void;
  // Save as
  showSaveModal: boolean;
  setShowSaveModal: (v: boolean) => void;
  saveRequestName: string;
  setSaveRequestName: (name: string) => void;
  // Import curl
  showImportCurlModal: boolean;
  setShowImportCurlModal: (v: boolean) => void;
  curlInput: string;
  setCurlInput: (v: string) => void;
  // Generate code
  showGenerateCodeModal: boolean;
  setShowGenerateCodeModal: (v: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  generatedCode: string;
}

/**
 * Centralised wrapper for the small modal components used throughout RestPage.
 * Keeps the main page free of repetitive JSX blocks.
 */
const RestModals: React.FC<RestModalsProps> = ({
  editModal,
  setEditModal,
  showSaveModal,
  setShowSaveModal,
  saveRequestName,
  setSaveRequestName,
  showImportCurlModal,
  setShowImportCurlModal,
  curlInput,
  setCurlInput,
  showGenerateCodeModal,
  setShowGenerateCodeModal,
  selectedLanguage,
  setSelectedLanguage,
  generatedCode,
}) => {
  return (
    <>
      {/* Edit Environment Modal */}
      <EditEnvironmentModal
        open={editModal !== null}
        onClose={() => setEditModal(null)}
        modalValue={editModal === 'global' ? 'Global' : 'Environment'}
        setModalValue={() => {}}
        onSave={() => setEditModal(null)}
      />

      {/* Save as Modal */}
      <SaveAsModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        saveRequestName={saveRequestName}
        setSaveRequestName={setSaveRequestName}
        onSave={() => setShowSaveModal(false)}
      />

      {/* Import cURL Modal */}
      <ImportCurlModal
        open={showImportCurlModal}
        onClose={() => setShowImportCurlModal(false)}
        curlInput={curlInput}
        setCurlInput={setCurlInput}
      />

      {/* Generate code Modal */}
      <GenerateCodeModal
        open={showGenerateCodeModal}
        onClose={() => setShowGenerateCodeModal(false)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        generatedCode={generatedCode}
      />
    </>
  );
};

export default RestModals;
