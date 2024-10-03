import { useGetUserProfile } from '@/services/auth/authQueries';
import {
  useGetDomainList,
  useGetJobList,
} from '@/services/specifications/specificationsQueries';

import { useToggleModal } from '@/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';

import Tag from '@/components/common/Tag';
import EditButton from '@/components/common/button/EditButton';
import SquareButton from '@/components/common/button/SquareButton';
import Dropdown from '@/components/common/dropdown/Dropdown';
import Label from '@/components/common/input/Label';
import TextInput from '@/components/common/input/TextInput';
import Modal from '@/components/common/modal/Modal';
import { DomainJobTechStackSchema } from '@/components/user/DomainJobTechStackSchema';

export default function DomainJobTechStackCard() {
  const { modalOpen, toggleModal } = useToggleModal();

  const { data: userProfile, isLoading } = useGetUserProfile();
  const { data: allJobList } = useGetJobList();
  const { data: allDomainList } = useGetDomainList();

  const listStyle = 'flex items-center py-2.5';
  const itemStyle = 'font-semibold tracking-tight px-2 mt-1.5 leading-5';

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

  if (isLoading) return null;

  return (
    <>
      <EditButton
        label="나의 새싹 정보 수정하기"
        className="absolute -top-[38px] right-2 text-gray2"
        onClick={toggleModal}
      />

      <div className="flex h-[190px] flex-1 flex-col justify-between divide-y rounded-3xl bg-white px-5 py-3 shadow-card md:w-full">
        <ul className={`${listStyle} gap-1.5`}>
          {domainList?.map(({ id, domain }) => (
            <li key={id}>
              <Tag text={domain} size="big" color="gray" />
            </li>
          ))}
        </ul>

        <ul className={listStyle}>
          {jobList?.map(({ job, id }) => (
            <li key={id} className={itemStyle}>
              {job}
            </li>
          ))}
        </ul>

        {/* 기술스택 */}
        <div className="overflow-x-scroll scrollbar-hide">
          <ul className={`${listStyle} flex w-full max-w-0 flex-1 gap-x-3`}>
            {techStackList?.map(({ id, techStack, iconImageUrl }) => (
              <li
                key={id}
                className="size-10 flex-shrink-0 rounded-lg bg-vividGreen3"
              >
                <img src={iconImageUrl} alt={techStack} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {modalOpen && (
        <Modal onToggleClick={toggleModal} title="도메인 정보">
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
                                    const filteredData =
                                      watchedDomainList.filter(
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
      )}
    </>
  );
}
