import { FormEvent, useEffect, useState } from 'react';

import { Button } from '@mycrypto/ui';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { DashboardPanel, Divider, LinkApp, SubHeading, Switch, Tooltip } from '@components';
import { Fiats, PRIVACY_POLICY_LINK, ROUTE_PATHS } from '@config';
import { migrateEIP1559FlagFromLocalStorage } from '@helpers';
import {
  AppState,
  canTrackProductAnalytics,
  getFiat,
  getIsEIP1559Enabled,
  setEIP1559Enabled,
  setFiat,
  setProductAnalyticsAuthorisation
} from '@store';
import { BREAK_POINTS, COLORS, SPACING } from '@theme';
import translate from '@translations';
import { TFiatTicker } from '@types';

const SettingsField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${SPACING.BASE};
  padding-top: 0;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: block;
  }
`;

const SettingsControl = styled.div`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: ${SPACING.SM};
    width: 100%;
    div {
      justify-content: flex-start;
    }
  }
`;

const SettingsButton = styled(Button)`
  width: 125px;
  padding: ${SPACING.SM};
`;

const SelectContainer = styled.div`
  border: 0.125em solid ${COLORS.BLUE_LIGHT};
  border-radius: 0.125em;
  padding: 0.6rem;
  width: 125px;
  select {
    width: 100%;
    border: none;
    height: 2em;
    background: none;
  }
`;

const GeneralSettings = ({
  fiatCurrency,
  setFiat,
  canTrackProductAnalytics,
  setProductAnalyticsAuthorisation,
  isEIP1559Enabled,
  setEIP1559Enabled
}: Props) => {
  const toggleAnalytics = () => {
    setProductAnalyticsAuthorisation(!canTrackProductAnalytics);
  };

  // Migrate from localStorage on first load
  // Only migrate if Redux state has never been set (undefined) and localStorage has a value
  // Note: migrateEIP1559FlagFromLocalStorage is not in dependency array as it's a stable function
  // that doesn't change between renders
  useEffect(() => {
    const migratedValue = migrateEIP1559FlagFromLocalStorage();
    // Only apply migration if both conditions are met:
    // 1. Redux state is undefined (never been set)
    // 2. localStorage had a value (migratedValue !== undefined)
    if (isEIP1559Enabled === undefined && migratedValue !== undefined) {
      setEIP1559Enabled(migratedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEIP1559Enabled, setEIP1559Enabled]);

  const toggleEIP1559 = () => {
    setEIP1559Enabled(!isEIP1559Enabled);
  };

  const changeCurrencySelection = (event: FormEvent<HTMLSelectElement>) => {
    const target = event.target as HTMLSelectElement;
    setFiat(target.value as TFiatTicker);
  };

  return (
    <DashboardPanel heading={translate('SETTINGS_GENERAL_LABEL')}>
      <Divider mb={SPACING.BASE} />
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_HANDLING_LABEL')}{' '}
          <Tooltip width="16px" tooltip={<span>{translate('SETTINGS_TOOLTIP')}</span>} />
        </SubHeading>
        <SettingsControl>
          <LinkApp href={ROUTE_PATHS.SETTINGS_IMPORT.path}>
            <SettingsButton secondary={true}>{translate('SETTINGS_IMPORT_LABEL')}</SettingsButton>
          </LinkApp>
          <LinkApp href={ROUTE_PATHS.SETTINGS_EXPORT.path} ml={SPACING.SM}>
            <SettingsButton secondary={true}>{translate('SETTINGS_EXPORT_LABEL')}</SettingsButton>
          </LinkApp>
        </SettingsControl>
      </SettingsField>
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_FIAT_SELECTION_LABEL')}{' '}
          <Tooltip
            width="16px"
            tooltip={<span>{translate('SETTINGS_FIAT_SELECTION_TOOLTIP')}</span>}
          />
        </SubHeading>
        <SettingsControl>
          <SelectContainer>
            <select onChange={changeCurrencySelection} value={String(fiatCurrency)}>
              {Object.keys(Fiats).map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </SelectContainer>
        </SettingsControl>
      </SettingsField>
      <SettingsField>
        <SubHeading fontWeight="initial">{translate('EIP_1559_SETTINGS_HEADER')}</SubHeading>
        <SettingsControl>
          <Switch
            id="toggle-eip1559"
            $greyable={true}
            checked={isEIP1559Enabled ?? true}
            onChange={toggleEIP1559}
            labelLeft="OFF"
            labelRight="ON"
          />
        </SettingsControl>
      </SettingsField>
      <SettingsField>
        <SubHeading fontWeight="initial">
          {translate('SETTINGS_PRODUCT_ANALYTICS')}{' '}
          <Tooltip
            width="16px"
            tooltip={
              <span>
                {translate('SETTINGS_PRODUCT_ANALYTICS_TOOLTIP', { $link: PRIVACY_POLICY_LINK })}
              </span>
            }
          />
        </SubHeading>
        <SettingsControl>
          <Switch
            id="toggle-analytics"
            $greyable={true}
            checked={canTrackProductAnalytics}
            onChange={toggleAnalytics}
            labelLeft="OFF"
            labelRight="ON"
          />
        </SettingsControl>
      </SettingsField>
    </DashboardPanel>
  );
};

const mapStateToProps = (state: AppState) => ({
  fiatCurrency: getFiat(state),
  canTrackProductAnalytics: canTrackProductAnalytics(state),
  isEIP1559Enabled: getIsEIP1559Enabled(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setFiat,
      setProductAnalyticsAuthorisation,
      setEIP1559Enabled
    },
    dispatch
  );

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(GeneralSettings);
