import { useParams } from 'react-router-dom';

import {
  usePatchUserToManagePhoneNumber, // usePostTraineeMemo,
} from '@/services/admin/userToManageMutation';
import { useGetUserToManageInfo } from '@/services/admin/userToManageQueries';

import { useDialogContext } from '@/hooks';
import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';
import { Domain, Job, TechStack } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';

import Title from '@/components/common/Title';
import SquareButton from '@/components/common/button/SquareButton';
import ScrollContainer from '@/components/common/container/ScrollContainer';
import ControllerPhoneNumber from '@/components/common/input/ControllerPhoneNumber';
import Modal from '@/components/common/modal/Modal';
import Tag from '@/components/common/tag/Tag';
import UserImage from '@/components/user/UserImage';
import { formSchema } from '@/components/user/UserManagementItem';

export default function UserManagementDetail() {
  const { userId } = useParams();

  const { data, isLoading } = useGetUserToManageInfo({ userId: +userId! });

  const userData = [
    {
      name: '이름',
      value: data?.profile.name,
    },
    {
      name: '이메일',
      value: data?.study.email,
    },
    {
      name: '전화번호',
      value: data?.profile.phoneNumber,
    },
    {
      name: '메모',
      value: undefined,
      emptyValue: '메모가 없습니다.',
    },
    {
      name: '특강 신청 내역',
      value: undefined,
      emptyValue: '특강 신청 내역이 없습니다.',
    },
  ];

  // const { mutateAsync: changeTraineeMemo } = usePostTraineeMemo();

  const { showDialog, hideDialog } = useDialogContext();

  const methods = useForm({
    defaultValues: { phoneNumber: '' },
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, setValue } = methods;

  const { mutateAsync: changePhoneNumber } = usePatchUserToManagePhoneNumber();

  const domainList: Domain[] = [];
  const jobList: Job[] = [];
  const techStackList: TechStack[] = [];

  const openModalClick = async (name: '메모' | '전화번호') => {
    if (name === '전화번호') {
      await showDialog({
        key: 'PHONE_NUMBER_CARD',
        element: (
          <Modal
            onClose={() => {
              setValue('phoneNumber', '');
              hideDialog();
            }}
            modalSize="md"
            title="전화번호 수정"
          >
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(({ phoneNumber }) => {
                  changePhoneNumber({ userId: +userId!, phoneNumber });
                })}
                className="mt-[26px]"
              >
                <div className="mb-2 text-lg font-medium">
                  <span className="text-mainGreen">{data?.profile.name}</span>{' '}
                  연락처
                </div>
                <div className="flex items-start justify-between gap-4">
                  <ControllerPhoneNumber
                    name="phoneNumber"
                    className="!rounded-xl bg-lightGray-active"
                  />
                  <SquareButton
                    type="submit"
                    name="확인"
                    color="gray"
                    className="h-[50px] min-w-fit !rounded-xl"
                  />
                </div>
              </form>
            </FormProvider>
          </Modal>
        ),
      });
    }
    if (name === '메모') {
      await showDialog({
        key: 'TRAINEE_MEMO_CARD',
        element: (
          <Modal onClose={hideDialog} modalSize="lg" title="메모">
            <div className="flex flex-col">
              <span className="text-darkGray">
                학생에 대한 메모를 볼 수 있어요.
              </span>

              <p className="mb-10 mt-4 min-h-32 text-darkGray-hover">
                메모가 아직 없어요
              </p>

              <SquareButton type="submit" name="수정하기" className="ml-auto" />
            </div>
          </Modal>
        ),
      });
    }
  };

  return (
    <MainView>
      {!isLoading && data && (
        <>
          <Header title={`${data.profile.name} 스프`} />

          <div className="flex gap-14">
            <div className="size-full rounded-xl bg-white p-8">
              <div className="flex gap-6">
                <UserImage
                  className="size-[110px]"
                  imageNameSegment={data.profile.profileUrl}
                />
                <div className="flex flex-col gap-2">
                  <Title title="수강정보" />
                  <span className="mt-2 truncate text-darkGray-active">
                    {data.study.campus[0].campusName}
                  </span>
                  <span className="line-clamp-1 text-darkGray-active">
                    {data.study.course
                      .map(({ courseName }) => courseName.slice(0, -3))
                      .join(', ')}{' '}
                  </span>
                </div>
              </div>

              <ul className="mt-10 flex flex-col gap-6">
                {userData.map(({ name, value, emptyValue }) => (
                  <li key={name} className="relative flex flex-col gap-[10px]">
                    <Title title={name} />

                    {value ? (
                      <span className="text-darkGray-active">{value}</span>
                    ) : (
                      <span className="text-darkGray">{emptyValue}</span>
                    )}

                    {(name === '전화번호' || name === '메모') && (
                      <SquareButton
                        name="수정하기"
                        color="gray"
                        className="absolute bottom-0 right-0"
                        onClick={() => {
                          openModalClick(name);
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="size-full rounded-xl bg-white p-8">
              <div className="mb-7">
                <Title title="도메인" />

                {domainList.length !== 0 ? (
                  <ScrollContainer className="gap-3" isBlurRight>
                    {domainList
                      ?.sort((a, b) => a.id - b.id)
                      ?.map(({ id, domain }) => (
                        <li key={id}>
                          <Tag
                            text={domain}
                            size="big"
                            color="grayLight"
                            className="px-[14px] py-[10px] !font-normal"
                          />
                        </li>
                      ))}
                  </ScrollContainer>
                ) : (
                  <span className="mt-[10px] inline-block text-darkGray">
                    도메인이 없습니다.
                  </span>
                )}
              </div>

              <div className="mb-7">
                <Title title="직무" />

                {jobList.length !== 0 ? (
                  <ScrollContainer className="gap-4" isBlurRight>
                    {jobList
                      ?.sort((a, b) => a.id - b.id)
                      ?.map(({ job, id }) => (
                        <li key={id} className="leading-5 tracking-tight">
                          {job}
                        </li>
                      ))}
                  </ScrollContainer>
                ) : (
                  <span className="mt-[10px] inline-block text-darkGray">
                    직무가 없습니다.
                  </span>
                )}
              </div>

              <div className="mb-7">
                <Title title="기술 스택" />

                {techStackList.length !== 0 ? (
                  <ScrollContainer className="gap-3" isBlurRight>
                    {techStackList
                      ?.sort((a, b) => a.id - b.id)
                      ?.map(({ id, techStack, iconImageUrl }) => (
                        <li key={id} className="size-7">
                          <img
                            src={iconImageUrl}
                            alt={techStack}
                            className="size-full"
                          />
                        </li>
                      ))}
                  </ScrollContainer>
                ) : (
                  <span className="mt-[10px] inline-block text-darkGray">
                    기술 스택이 없습니다.
                  </span>
                )}
              </div>

              <div className="mt-16">
                <Title title="김철수님이 작성한 글" />
              </div>
            </div>
          </div>
        </>
      )}
    </MainView>
  );
}
