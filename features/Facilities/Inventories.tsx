import { useGetVault } from '@/api/queries/vault.queries';
import useToggleModal from '@/hooks/useToggleModal';
import PlusIcon from '@/public/icons/PlusIcon';
import { Accordion, Badge, Button, Spinner } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import CreateInventoryModal from './CreateInventoryModal';
import CreateTankModal, { tankTypes } from './CreateTankModal';

import useFacilityMutation from '@/api/mutations/useFacilityMutation';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import PencilAlt from '@/public/icons/PencilAlt';
import { Chip } from '@mui/material';
import classNames from 'classnames';
import _ from 'lodash';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import EditTankModal from './EditTank/EditTankModal';

function getTankModelLabel(value: string): string | undefined {
  const tankType = tankTypes.find(tank => tank.value === value);
  return tankType ? tankType.label : '';
}

const Inventories = () => {
  const { t } = useTranslation('facilities');
  const { Panel, Title, Content } = Accordion;
  const router = useRouter();

  const [vaultId, setVaultId] = useState<string>('');
  const [tankId, setTankId] = useState('');
  const [tankName, setTankName] = useState('');
  const [openAlert, toggleAlert] = useState(false);

  const { data: vaultData, isLoading, mutate } = useGetVault({ facilityId: router.query.id as string });
  const { deleteVault, deleteTank } = useFacilityMutation();

  const {
    isModalOpen: isInventoryModalOpen,
    onCloseModal: closeInventoryModal,
    onOpenModal: openInventoryModal,
  } = useToggleModal();

  const {
    isModalOpen: isEditTankModalOpen,
    onCloseModal: closeEditTankModal,
    onOpenModal: openEditTankModal,
  } = useToggleModal();

  const { isModalOpen: isTankModalOpen, onCloseModal: closeTankModal, onOpenModal: openTankModal } = useToggleModal();

  const onInventoryModalClose = (isSubmitted?: boolean) => {
    if (isSubmitted) {
      mutate(undefined, { revalidate: true });
    }
    closeInventoryModal();
  };

  const onTankModalClose = (isSubmitted?: boolean) => {
    if (isSubmitted) {
      mutate(undefined, { revalidate: true });
    }
    setVaultId('');
    closeTankModal();
  };

  const onCloseModal = () => {
    toggleAlert(false);
    setVaultId('');
    setTankId('');
  };

  const openVaultDelete = (id: string) => {
    setVaultId(id);
    toggleAlert(true);
  };

  const openTankDelete = (id: string) => {
    setTankId(id);
    toggleAlert(true);
  };

  const openTankEdit = (id: string, name: string) => {
    setTankId(id);
    setTankName(name);
    openEditTankModal();
  };

  const onTankDelete = () => {
    deleteTank
      .trigger({ id: tankId })
      .then(() => {
        mutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data) {
          toast.error(reason.response.data?.errors?.TankId[0]);
        }
      })
      .finally(() => onCloseModal());
  };

  const onVaultDelete = () => {
    deleteVault
      .trigger({ id: vaultId })
      .then(() => {
        mutate(undefined, { revalidate: true });
      })
      .catch(reason => {
        if (reason?.response?.data) {
          toast.error(reason.response.data?.errors?.VaultId[0]);
        }
      })
      .finally(() => onCloseModal());
  };

  const onTankModalOpen = (selectedVaultId: string) => {
    setVaultId(selectedVaultId);
    openTankModal();
  };

  return (
    <Fragment>
      <ConfirmationModal
        isOpen={openAlert}
        onClose={onCloseModal}
        onConfirm={tankId ? onTankDelete : onVaultDelete}
        isLoading={deleteVault.isMutating || deleteTank.isMutating}
        title={t('common:delete')}
        message={t('common:deleteConfirmation')}
      />

      <div
        className="flex w-full flex-col gap-3 rounded-md border border-transparent p-4 sm:p-8 md:max-w-full dark:bg-[#1E2021]"
        data-testid="inventories-container">
        <div className="mb-6 flex items-center justify-between" data-testid="inventories-header">
          <span className="text-2xl font-normal text-white"> {t('inventories')}</span>

          <Button gradientDuoTone="primary" size="sm" onClick={openInventoryModal} data-testid="add-inventory-button">
            <div className="mr-2">
              <PlusIcon />
            </div>
            {t('addInventory')}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex w-full justify-center py-5" data-testid="loading-spinner">
            <div className="flex items-center gap-2 text-sm">
              <Spinner size="sm" className="mt-[-1px]" /> Loading...
            </div>
          </div>
        ) : null}

        {vaultData?.items?.map((vault: any, index: number) => (
          <Accordion className="border-0" key={vault.id} collapseAll={true} data-testid="vault">
            <Panel>
              <Title data-testid="vault-title">
                <div className="flex w-full flex-wrap items-center gap-4 overflow-hidden text-center">
                  <div className="w-fit break-all text-left" data-testid="vault-name">
                    {vault.name}
                  </div>
                  <div className="flex gap-1">
                    <div className="w-fit text-left text-sm text-[#828282]" data-testid="vault-canes-count">{`${
                      vault.canesCount
                    } ${t('facilityDetailsPage.canes')}`}</div>
                    <div className="inline-block min-h-[1em] w-[1px] self-stretch bg-neutral-100 dark:bg-white/10"></div>
                    <div className="w-fit text-left text-sm text-[#828282]" data-testid="vault-devices-count">{`${
                      vault.devicesCount
                    } ${t('facilityDetailsPage.devices')}`}</div>
                    <div className="inline-block min-h-[1em] w-[1px] self-stretch bg-neutral-100 dark:bg-white/10"></div>
                    <div className="w-fit text-left text-sm text-[#828282]" data-testid="vault-specimens-count">{`${
                      vault.specimensCount
                    } ${t('facilityDetailsPage.specimens')}`}</div>
                  </div>

                  <Badge
                    color={'cryo'}
                    className="item-center flex h-[22px] w-[28px] justify-center text-center"
                    data-testid="vault-tanks-count">
                    {vault.tanks.length}
                  </Badge>
                </div>
              </Title>

              <Content>
                {vault.tanks.map((tank: any) => (
                  <div key={tank.id} className="flex items-center justify-between py-3" data-testid="tank">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium text-[#828282]">Tank</span>
                      <span className="text-xs font-semibold uppercase" data-testid="tank-name">
                        {tank.name}
                      </span>
                      <span className="text-xs font-medium text-[#828282]">|</span>
                      <span className="text-xs font-medium text-gray-50" data-testid="tank-model">
                        {getTankModelLabel(tank.model)}
                      </span>
                      <span className="text-xs font-medium text-[#828282]">|</span>
                      <Chip
                        label={tank?.isReactive ? 'Reactive' : 'Non-Reactive'}
                        size="small"
                        sx={{
                          color: 'white',
                          backgroundColor: '#292A2C',
                          borderRadius: '6px',
                          fontSize: '12px',
                        }}
                        data-testid="tank-reactivity"
                      />
                      <span className="text-xs font-medium text-[#828282]">|</span>
                      <div className="flex items-start gap-1">
                        <div className="w-fit text-left text-xs text-[#828282]" data-testid="tank-canes-count">{`${
                          tank.canesCount
                        } ${t('facilityDetailsPage.canes')}`}</div>
                        <span className="text-xs font-medium text-[#828282]">|</span>
                        <div className="w-fit text-left text-xs text-[#828282]" data-testid="tank-devices-count">{`${
                          tank.devicesCount
                        } ${t('facilityDetailsPage.devices')}`}</div>
                        <span className="text-xs font-medium text-[#828282]">|</span>
                        <div className="w-fit text-left text-xs text-[#828282]" data-testid="tank-specimens-count">{`${
                          tank.specimensCount
                        } ${t('facilityDetailsPage.specimens')}`}</div>
                      </div>
                      <div
                        className={classNames('mt-[-1px] flex cursor-pointer items-center gap-1 text-xs font-light')}
                        onClick={() => openTankEdit(tank?.id, tank?.name)}
                        data-testid="tank-edit">
                        <PencilAlt />
                        {t('editTank')}
                      </div>
                      <div
                        className={classNames('mt-[-1px] flex cursor-pointer items-center gap-1 text-xs font-light', {
                          'pointer-events-none opacity-25': Number(tank?.canesCount) > 0,
                        })}
                        onClick={() => openTankDelete(tank.id)}
                        data-testid="tank-delete">
                        <MdDelete />
                        Delete
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end gap-4">
                  <Button
                    gradientDuoTone="primary"
                    size="xs"
                    onClick={() => onTankModalOpen(vault.id)}
                    data-testid="add-tank-button">
                    <div className="mr-2">
                      <PlusIcon />
                    </div>
                    {t('addTank')}
                  </Button>

                  <Button
                    size="xs"
                    gradientDuoTone="pinkToOrange"
                    onClick={() => openVaultDelete(vault.id)}
                    disabled={!_.isEmpty(vault.tanks)}
                    data-testid="delete-vault-button">
                    <div className="mr-2">
                      <MdDelete />
                    </div>
                    {t('deleteVault')}
                  </Button>
                </div>
                {vaultData?.items.length - 1 !== index && <hr className="mt-6 h-px border-0 dark:bg-gray-600" />}
              </Content>
            </Panel>
          </Accordion>
        ))}
      </div>

      <CreateInventoryModal isOpen={isInventoryModalOpen} onClose={onInventoryModalClose} />
      <CreateTankModal isOpen={isTankModalOpen} onClose={onTankModalClose} vaultId={vaultId} />
      <EditTankModal
        isOpen={isEditTankModalOpen}
        onClose={closeEditTankModal}
        refetchTankList={mutate}
        tankId={tankId}
        tankName={tankName}
      />
    </Fragment>
  );
};

export default Inventories;
