export default async (Field) => {
  if ((Field.inEdit.name.fi || Field.inEdit.name.en) && !Field.inEdit.name.und) {
    Field.inEdit.name.und = Field.inEdit.name.fi || Field.inEdit.name.en
  }
  await Field.save()
  Field.clearInEdit()
}
