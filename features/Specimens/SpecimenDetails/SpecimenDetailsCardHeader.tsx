import PencilAlt from '@/public/icons/PencilAlt';
import { Button } from 'flowbite-react';
import React from 'react';
import { MdDelete } from 'react-icons/md';

interface SpecimenNodeProps {
  id: string;
  openEditModal: (index: number) => void;
  onOpenDeleteModal: (id: string) => void;
  openUpdateCaneLocationModal: () => void;
  openAddCaneLocationModal: () => void;
  openUpdateRfidModal: () => void;
  editBtnlabel: string;
  deleteBtnlabel: string;
  updateCaneLocationBtnlabel: string;
  updateRfidBtnlabel: string;
  addCaneLocationBtnlabel: string;
  showUpdateLocation: boolean;
  showAddLocation: boolean;
}

const SpecimenDetailsCardHeader: React.FC<SpecimenNodeProps> = ({
  id,
  openEditModal,
  onOpenDeleteModal,
  editBtnlabel,
  deleteBtnlabel,
  openUpdateCaneLocationModal,
  openUpdateRfidModal,
  updateCaneLocationBtnlabel,
  addCaneLocationBtnlabel,
  updateRfidBtnlabel,
  openAddCaneLocationModal,
  showUpdateLocation,
  showAddLocation,
}) => {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {showAddLocation && (
        <Button gradientDuoTone={'primary'} size={'sm'} onClick={openAddCaneLocationModal}>
          <div className="mr-2">
            <PencilAlt />
          </div>
          {addCaneLocationBtnlabel}
        </Button>
      )}
      {showUpdateLocation && (
        <Button gradientDuoTone={'primary'} size={'sm'} onClick={openUpdateCaneLocationModal}>
          <div className="mr-2">
            <PencilAlt />
          </div>
          {updateCaneLocationBtnlabel}
        </Button>
      )}
      <Button gradientDuoTone={'primary'} size={'sm'} onClick={openEditModal}>
        <div className="mr-2">
          <PencilAlt />
        </div>
        {editBtnlabel}
      </Button>
      <Button gradientDuoTone={'primary'} size={'sm'} onClick={() => onOpenDeleteModal(id)}>
        <div className="mr-2">
          <MdDelete />
        </div>
        {deleteBtnlabel}
      </Button>
      <Button gradientDuoTone={'primary'} size={'sm'} onClick={openUpdateRfidModal}>
        <div className="mr-2">
          <PencilAlt />
        </div>
        {updateRfidBtnlabel}
      </Button>
    </div>
  );
};

export default SpecimenDetailsCardHeader;
