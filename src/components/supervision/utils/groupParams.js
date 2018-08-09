import { I18n } from 'react-redux-i18n';

export default function (params) {
  let ungrouped = Symbol.for(I18n.t('supervision.physics.ungrouped'));
  let groups = {
    [ungrouped]: []
  };
  let groupNames = [];
  let titles = [];
  groupNames.push(ungrouped);
  titles.push(I18n.t('supervision.ungrouped'));

  params.map((item, index) => {
    let match = item.name.match(/\(([^)]+)\)$/);
    if (match && match.length > 0) {
      let group = Symbol.for(match[1]);
      if (!Array.isArray(groups[group])) {
        groups[group] = [];
        groupNames.push(group);
        titles.push(match[1]);
      }

      groups[group].push(item);
    } else {
      groups[ungrouped].push(item);
    }
  });

  if (groupNames === 1) {
    return null;
  }

  return {
    names: groupNames,
    titles: titles,
    blocks: groups
  }
}
