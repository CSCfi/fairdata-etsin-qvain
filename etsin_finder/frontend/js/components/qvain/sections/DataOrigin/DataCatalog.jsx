import { useEffect } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'
import { FieldGroup } from '@/components/qvain/general/V2'
import { HelpField } from '@/components/qvain/general/modal/form'
import IdaSvg from '@/assets/images/data-ida.svg'
import AttSvg from '@/assets/images/data-remote.svg'
import PasSvg from '@/assets/images/data-pas.svg'
import CatalogButton from './CatalogButton'
import DataCatalogError from './DataCatalogError'

const DataCatalog = observer(() => {
  const {
    Qvain: { isPas },
  } = useStores()

  return isPas ? <PasDataCatalog /> : <BasicDataCatalog />
})

DataCatalog.displayName = 'DataCatalog'

const PasDataCatalog = observer(() => {
  const {
    Qvain: { isPreserved },
  } = useStores()

  return (
    <FieldGroup>
      <ButtonContainer>
        {isPreserved ? (
          <CatalogButton
            tabIndex={0}
            id="pas-catalog-btn"
            type="button"
            image={PasSvg}
            onClick={() => undefined}
          >
            <Translate
              component={'div'}
              attributes={{ title: 'qvain.sections.dataOrigin.buttons.pas.done.title' }}
            >
              <Translate content="qvain.sections.dataOrigin.buttons.pas.done.description" />
            </Translate>
          </CatalogButton>
        ) : (
          <CatalogButton
            tabIndex={0}
            id="pas-catalog-btn"
            type="button"
            image={PasSvg}
            onClick={() => undefined}
            disabled
          >
            <Translate
              component={'div'}
              attributes={{ title: 'qvain.sections.dataOrigin.buttons.pas.inProcess.title' }}
            >
              <Translate content="qvain.sections.dataOrigin.buttons.pas.inProcess.description" />
            </Translate>
          </CatalogButton>
        )}
      </ButtonContainer>
    </FieldGroup>
  )
})

PasDataCatalog.displayName = 'PasDataCatalog'

const BasicDataCatalog = observer(() => {
  const {
    Qvain: {
      setDataCatalog,
      isDataCatalogDecided,
      dataCatalog,
      editorInitialized,
      ensureBasicDataCatalogs,
      basicDataCatalogsError,
    },
  } = useStores()

  useEffect(() => {
    if (editorInitialized && !isDataCatalogDecided) {
      ensureBasicDataCatalogs()
    }
  }, [editorInitialized, isDataCatalogDecided, ensureBasicDataCatalogs])

  const idaOnClick = () =>
    !isDataCatalogDecided && dataCatalog === DATA_CATALOG_IDENTIFIER.IDA
      ? setDataCatalog(undefined)
      : setDataCatalog(DATA_CATALOG_IDENTIFIER.IDA)

  const attOnClick = () =>
    !isDataCatalogDecided && dataCatalog === DATA_CATALOG_IDENTIFIER.ATT
      ? setDataCatalog(undefined)
      : setDataCatalog(DATA_CATALOG_IDENTIFIER.ATT)

  if (basicDataCatalogsError) {
    return <DataCatalogError />
  }

  return (
    <FieldGroup>
      <ButtonContainer>
        <Translate
          id="ida-catalog-btn"
          onClick={idaOnClick}
          component={CatalogButton}
          image={IdaSvg}
          attributes={{ title: 'qvain.sections.dataOrigin.buttons.ida.title' }}
          selected={dataCatalog === DATA_CATALOG_IDENTIFIER.IDA}
          disabled={isDataCatalogDecided && dataCatalog !== DATA_CATALOG_IDENTIFIER.IDA}
          cy="data-source-ida"
        >
          <Translate content="qvain.sections.dataOrigin.buttons.ida.description" />
        </Translate>
        <Translate
          id="att-catalog-btn"
          onClick={attOnClick}
          component={CatalogButton}
          image={AttSvg}
          attributes={{ title: 'qvain.sections.dataOrigin.buttons.att.title' }}
          selected={dataCatalog === DATA_CATALOG_IDENTIFIER.ATT}
          disabled={isDataCatalogDecided && dataCatalog !== DATA_CATALOG_IDENTIFIER.ATT}
          cy="data-source-att"
        >
          <Translate content="qvain.sections.dataOrigin.buttons.att.description" />
        </Translate>
      </ButtonContainer>
      <HelpField>
        <Translate content="qvain.sections.dataOrigin.infoText" />
      </HelpField>
    </FieldGroup>
  )
})

BasicDataCatalog.displayName = 'BasicDataCatalog'

const ButtonContainer = styled.div`
  gap: 1.5rem;
  margin-bottom: 0rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12em, 1fr));
`

export default DataCatalog
