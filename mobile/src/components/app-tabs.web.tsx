import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet, Text } from 'react-native';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { OutlineIcon, OutlineIconName } from '@/components/outline-icon';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/home" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
          <TabTrigger name="report" href="/report" asChild>
            <TabButton>Report Issue</TabButton>
          </TabTrigger>
          <TabTrigger name="my-reports" href="/my-reports" asChild>
            <TabButton>My Reports</TabButton>
          </TabTrigger>
          <TabTrigger name="updates" href="/updates" asChild>
            <TabButton>Updates</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const iconByLabel: Record<string, OutlineIconName> = {
    Home: 'home-outline',
    'Report Issue': 'plus-circle-outline',
    'My Reports': 'file-document-outline',
    Updates: 'bell-outline',
  };
  const label = String(children);

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View style={[styles.tabButtonView, isFocused && styles.tabButtonFocused]}>
        <OutlineIcon
          name={iconByLabel[label] ?? 'circle-outline'}
          size={16}
          color={isFocused ? '#A1000B' : '#78696C'}
        />
        <Text style={[styles.tabButtonText, isFocused && styles.tabButtonTextFocused]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.brandText}>UM Fixhub</Text>

        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.one,
    maxWidth: MaxContentWidth,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDE4DC',
  },
  brandText: {
    marginRight: Spacing.two,
    color: '#2A1015',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  tabButtonFocused: {
    backgroundColor: '#F7E7B5',
  },
  tabButtonText: {
    color: '#78696C',
    fontSize: 12,
    fontWeight: '600',
  },
  tabButtonTextFocused: {
    color: '#A1000B',
  },
});
