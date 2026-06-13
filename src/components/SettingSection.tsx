import { View } from 'react-native';

import { AppText } from './AppText';
import { SectionHeader } from './SectionHeader';
import { SettingGroup } from './SettingGroup';
import { spacing } from '@/constants/spacing';

type Props = {
  title: string;
  footer?: string;
  spacingTop?: number;
  /** 카드 없이 footer+children만 (데이터 destructive 등) */
  bare?: boolean;
  children: React.ReactNode;
};

export function SettingSection({ title, footer, spacingTop, bare, children }: Props) {
  return (
    <View style={{ marginBottom: spacing.section, gap: spacing.sm }}>
      <SectionHeader
        title={title}
        variant="caption"
        spacingTop={spacingTop ?? spacing.section}
      />
      {bare ? children : <SettingGroup>{children}</SettingGroup>}
      {footer && (
        <AppText
          variant="caption"
          tone="tertiary"
          style={{
            paddingHorizontal: spacing.screen,
            lineHeight: 17,
          }}
        >
          {footer}
        </AppText>
      )}
    </View>
  );
}
