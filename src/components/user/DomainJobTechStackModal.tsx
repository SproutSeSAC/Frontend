import { useDialogContext } from '@/hooks';
import { Domain, Job, UserProfile } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import Tag from '@/components/common/Tag';
import SquareButton from '@/components/common/button/SquareButton';
import Dropdown from '@/components/common/dropdown/Dropdown';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import { DomainJobTechStackSchema } from '@/components/user/DomainJobTechStackSchema';

interface DomainJobTechStackModalProps {
  userProfile: UserProfile;
  allJobList: Job[];
  allDomainList: Domain[];
}

export default function DomainJobTechStackModal({
  userProfile,
  allJobList,
  allDomainList,
}: DomainJobTechStackModalProps) {
  const { hideDialog } = useDialogContext();

  const { jobList, techStackList, domainList } = userProfile || {};

  const defaultFormValues = {
    updatedTechStackIdList: techStackList || [],
    updatedJobIdList: jobList || [],
    updatedDomainIdList: domainList || [],
  };

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: defaultFormValues,
    resolver: zodResolver(DomainJobTechStackSchema),
  });

  const { handleSubmit, control } = methods;

  const watchedDomainList = useWatch({ control, name: 'updatedDomainIdList' });
  const watchedJobList = useWatch({ control, name: 'updatedJobIdList' });

  return (
    <Modal onToggleClick={hideDialog} title="도메인 정보">
      <FormProvider {...methods}>
        <form
          className="mt-3 flex w-[350px] flex-col gap-4"
          onSubmit={handleSubmit(() => console.log('?'))}
        >
          <div>
            <Label htmlFor="관심 도메인" className="mb-2" />

            {allDomainList && (
              <Controller
                control={control}
                name="updatedDomainIdList"
                render={({ field: { onChange } }) => {
                  return (
                    <>
                      <ul className="flex gap-1">
                        {watchedDomainList?.map(({ id, domain }) => (
                          <li key={id}>
                            <Tag
                              text={domain}
                              color="green"
                              size="medium"
                              onDeleteClick={() => {
                                const filteredData = watchedDomainList.filter(
                                  item => item.id !== id,
                                );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ))}
                      </ul>

                      <Dropdown
                        label="관심 도메인"
                        selectedOptionId={undefined}
                        options={allDomainList.map(({ id, domain }) => {
                          return { id, name: domain };
                        })}
                        selectBoxClassName="[&>span]:text-gray1 mt-2"
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => {
                            return { id, domain: name };
                          });
                          onChange([...watchedDomainList, ...newData]);
                        }}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div>
            <Label htmlFor="관심 직무" />

            {allJobList && (
              <Controller
                control={control}
                name="updatedJobIdList"
                render={({ field: { onChange } }) => {
                  return (
                    <>
                      <ul className="flex gap-1">
                        {watchedJobList?.map(({ id, job }) => (
                          <li key={id}>
                            <Tag
                              text={job}
                              color="olivegreen"
                              size="medium"
                              onDeleteClick={() => {
                                const filteredData = watchedJobList.filter(
                                  item => item.id !== id,
                                );
                                onChange(filteredData);
                              }}
                            />
                          </li>
                        ))}
                      </ul>

                      <Dropdown
                        label="관심 직무"
                        selectedOptionId={undefined}
                        options={allJobList.map(({ id, job }) => {
                          return { id, name: job };
                        })}
                        selectBoxClassName="[&>span]:text-gray1 mt-2"
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => {
                            return { id, job: name };
                          });
                          onChange([...watchedJobList, ...newData]);
                        }}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div>
            <Label htmlFor="기술 스택" />
            <ul className="mb-2 flex gap-1">
              {techStackList?.map(({ id, techStack, iconImageUrl }) => (
                <li
                  key={id}
                  className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
                >
                  <img src={iconImageUrl} alt={techStack} />
                </li>
              ))}
            </ul>
            <TextInput
              name="기술 스택"
              placeholder="기술 스택을 등록해주세요."
              onChange={() => {}}
              className="mb-6"
            />
          </div>

          <SquareButton
            name="저장하기"
            onClick={() => {}}
            className="self-end"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
