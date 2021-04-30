export const shouldUserMenuClose = (avatarModalOpen, userMenuRef, target) => {
  const { id, tagName } = target;
  const { id: parentId } = target.parentElement;
  const { id: parentParentId } = target.parentElement.parentElement;

  if (
    avatarModalOpen ||
    userMenuRef?.current?.contains(target) ||
    id === 'user-menu' ||
    id === 'user-menu-toggle' ||
    (tagName === 'svg' && parentId === 'user-menu-toggle') ||
    (tagName === 'path' && parentParentId === 'user-menu-toggle')
  ) {
    return;
  }

  return true;
};
