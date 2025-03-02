import { useDialogContext, useUpdateProfile } from '@/hooks';
import { Domain, Job, Option, TechStack, UserProfileDto } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import SquareButton from '@/components/common/button/SquareButton';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import SingleSelectDropdown from '@/components/common/dropdown/SingleSelectDropdown';
import TechStackDropdown from '@/components/common/dropdown/TechStackDropdown';
import Label from '@/components/common/input/Label';
import Modal from '@/components/common/modal/Modal';
import Tag from '@/components/common/tag/Tag';
import { DomainJobTechStackSchema } from '@/components/user/DomainJobTechStackSchema';

type FormValue = {
  updatedTechStackList: TechStack[];
  updatedJobList: Job[];
  updatedDomainList: Domain[];
};

type GetOptions = (type: 'domain' | 'job', list: Domain[] | Job[]) => Option[];

type UpdateableValue = Pick<
  UserProfileDto.Update,
  'updatedDomainIdList' | 'updatedJobIdList' | 'updatedTechStackIdList'
>;

export default function DomainJobTechStackModal() {
  const { hideDialog } = useDialogContext();

  const {
    userProfile,
    domainList: allDomainList,
    jobList: allJobList,
    techStackList: allTechStackList,
    mutateAsync,
    isLoading,
  } = useUpdateProfile();

  const {
    jobList: userJobList,
    techStackList: userTechStackList,
    domainList: userDomainList,
  } = userProfile;

  const defaultFormValues: FormValue = {
    updatedTechStackList: userTechStackList,
    updatedJobList: userJobList,
    updatedDomainList: userDomainList,
  };

  const methods = useForm<FormValue>({
    mode: 'onSubmit',
    defaultValues: defaultFormValues,
    resolver: zodResolver(DomainJobTechStackSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { dirtyFields, isValid },
  } = methods;

  const onSubmit: SubmitHandler<FormValue> = (formData: FormValue) => {
    const matchedKeyObj = {
      updatedDomainList: 'updatedDomainIdList',
      updatedJobList: 'updatedJobIdList',
      updatedTechStackList: 'updatedTechStackIdList',
    };

    const updatedValue = Object.entries(matchedKeyObj).reduce<UpdateableValue>(
      (acc, [originalKey, newKey]) => {
        if (dirtyFields[originalKey as keyof FormValue]) {
          acc[newKey as keyof UpdateableValue] = formData[
            originalKey as keyof FormValue
          ].map(({ id }) => id);
        }
        return acc;
      },
      {},
    );

    mutateAsync(updatedValue);
    hideDialog();
  };

  const getOptions: GetOptions = (type, list) => {
    switch (type) {
      case 'domain':
        return (list as Domain[]).map(({ id, domain }) => {
          return { id, name: domain };
        });
      case 'job':
        return (list as Job[]).map(({ id, job }) => {
          return { id, name: job };
        });
      default:
        return [];
    }
  };

  if (isLoading) return null;

  return (
    <Modal onToggleClick={hideDialog} title="도메인 정보" className="p-[40px]">
      <FormProvider {...methods}>
        <form
          className="mt-8 flex w-[40vw] min-w-[350px] flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <Label htmlFor="관심 도메인" className="mb-4 text-xl font-medium" />
            {allDomainList && (
              <Controller
                control={control}
                name="updatedDomainList"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  const selectedOptions = value?.map(({ id, domain }) => ({
                    id,
                    name: domain,
                  }));

                  return (
                    <>
                      {value.length > 0 && (
                        <ScrollContainer gap={5}>
                          {value.map(({ id, domain }) => (
                            <li key={id} className="mb-3">
                              <Tag
                                text={domain}
                                color="green"
                                size="medium"
                                onDeleteClick={() => {
                                  const filteredData = value.filter(
                                    item => item.id !== id,
                                  );
                                  onChange(filteredData);
                                }}
                                className="h-[30px]"
                              />
                            </li>
                          ))}
                        </ScrollContainer>
                      )}

                      <SingleSelectDropdown
                        defaultLabel="관심 도메인"
                        options={getOptions('domain', allDomainList)}
                        selectedOptions={selectedOptions}
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => ({
                            id,
                            domain: name,
                          }));
                          const newArr = [...value, ...newData];
                          onChange(newArr);
                        }}
                        selectBoxClassName="h-[50px] rounded-lg !text-base  border border-darkGray"
                        errorMsg={errors.updatedDomainList?.message}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div className="flex flex-col">
            <Label htmlFor="관심 직무" className="mb-4 text-xl font-medium" />
            {allJobList && (
              <Controller
                control={control}
                name="updatedJobList"
                render={({
                  field: { onChange, value },
                  formState: { errors },
                }) => {
                  const selectedOptions = value?.map(({ id, job }) => ({
                    id,
                    name: job,
                  }));
                  return (
                    <>
                      {value.length > 0 && (
                        <ScrollContainer gap={5}>
                          {value?.map(({ id, job }) => (
                            <li key={id} className="mb-3">
                              <Tag
                                text={job}
                                color="green"
                                size="medium"
                                onDeleteClick={() => {
                                  const filteredData = value.filter(
                                    item => item.id !== id,
                                  );
                                  onChange(filteredData);
                                }}
                                className="h-[30px]"
                              />
                            </li>
                          ))}
                        </ScrollContainer>
                      )}

                      <SingleSelectDropdown
                        defaultLabel="관심 직무"
                        options={getOptions('job', allJobList)}
                        selectedOptions={selectedOptions}
                        onChangeValue={data => {
                          const newData = data.map(({ id, name }) => ({
                            id,
                            job: name,
                          }));
                          const newArr = [...value, ...newData];
                          onChange(newArr);
                        }}
                        selectBoxClassName="h-[50px] rounded-lg !text-base border border-darkGray"
                        errorMsg={errors.updatedJobList?.message}
                      />
                    </>
                  );
                }}
              />
            )}
          </div>

          <div className="relative flex flex-col">
            <Label htmlFor="기술 스택" className="mb-4 text-xl font-medium" />
            <Controller
              control={control}
              name="updatedTechStackList"
              render={({
                field: { onChange, value },
                formState: { errors },
              }) => {
                const currValue = value.map(({ id }) => id);
                return (
                  <TechStackDropdown
                    defaultLabel="기술 스택"
                    defaultTabValue="백엔드"
                    value={currValue}
                    options={allTechStackList}
                    onChangeValue={onChange}
                    isMarkTechStackList
                    errorMsg={errors.updatedTechStackList?.message}
                    selectBoxClassName="h-[50px] rounded-lg !text-base border border-darkGray"
                  />
                );
              }}
            />
          </div>

          <SquareButton
            name="저장하기"
            type="submit"
            color={isValid ? 'mainGreen' : 'gray'}
            className="mt-10 h-[58px] text-base"
          />
        </form>
      </FormProvider>
    </Modal>
  );
}
