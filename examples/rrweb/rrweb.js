/**
 * rrweb 源码简易版伪代码
 * @param {*} e
 * @returns
 */

function wrapEvent(e) {
  return Object.assign(Object.assign({}, e), { timestamp: Date.now() });
}
// record 方法实现
// 1. 拍全量快照，触发 emit
// 2. 监听页面滚动、鼠标、resize、dom 变化等事件，触发 emit
// 3. 1 和 2 的结果需要存储在服务端，所以需要映射表去关联每个 node 节点，也就是需要做序列化处理，
//    这些数据也是为后续 replay 回放需要
function record(options = {}) {
  let incrementalSnapshotCount = 0;
  wrappedEmit = (e, isCheckout) => {
    emit(eventProcessor(e), isCheckout);
    if (exceedCount || exceedTime) {
      takeFullSnapshot(true);
    }
  };
  takeFullSnapshot = (isCheckout = false) => {
    wrappedEmit(
      wrapEvent({
        type: EventType.Meta,
        data: {
          href: window.location.href,
          width: getWindowWidth(),
          height: getWindowHeight(),
        },
      }),
      isCheckout
    );
    // 获取了文档的全量快照，同时维护了一个节点和 ID 的映射 mirror
    const node = snapshot(document, {
      mirror,
      // ...
    });
    wrappedEmit(
      wrapEvent({
        type: EventType.FullSnapshot,
        data: {
          node,
          initialOffset: {
            // left: ,
            // top: ,
          },
        },
      })
    );
  };
  const handlers = [];
  const observe = (doc) => {
    return initObservers(
      {
        mutationCb: (m) =>
          wrappedEmit(
            wrapEvent({
              type: EventType.IncrementalSnapshot,
              data: Object.assign({ source: IncrementalSource.Mutation }, m),
            })
          ),
        mousemoveCb: (positions, source) =>
          wrappedEmit(
            wrapEvent({
              type: EventType.IncrementalSnapshot,
              data: {
                source,
                positions,
              },
            })
          ),
        // 其他监听器...
      },
      hooks
    );
  };
  const init = () => {
    takeFullSnapshot();
    handlers.push(observe(document));
    recording = true;
  };
  init();
  return () => {
    handlers.forEach((h) => h());
    recording = false;
  };
}

function initObservers(o, hooks = {}) {
  const mutationObserver = initMutationObserver(o, o.doc);
  const mousemoveHandler = initMoveObserver(o);
  // 其他监听器...
}

function initMoveObserver({ mousemoveCb, sampling, doc, mirror }) {
  const threshold =
    typeof sampling.mousemove === "number" ? sampling.mousemove : 50;
  const callbackThreshold =
    typeof sampling.mousemoveCallback === "number"
      ? sampling.mousemoveCallback
      : 500;
  let positions = [];
  const wrappedCb = throttle((source) => {
    const totalOffset = Date.now() - timeBaseline;
    mousemoveCb(
      positions.map((p) => {
        p.timeOffset -= totalOffset;
        return p;
      }),
      source
    );
    positions = [];
  }, callbackThreshold);
  const updatePosition = throttle(
    (evt) => {
      const target = getEventTarget(evt);
      const { clientX, clientY } = isTouchEvent(evt)
        ? evt.changedTouches[0]
        : evt;
      positions.push({
        x: clientX,
        y: clientY,
        id: mirror.getId(target),
        timeOffset: Date.now() - timeBaseline,
      });
      wrappedCb(
        typeof DragEvent !== "undefined" && evt instanceof DragEvent
          ? IncrementalSource.Drag
          : evt instanceof MouseEvent
          ? IncrementalSource.MouseMove
          : IncrementalSource.TouchMove
      );
    },
    threshold,
    {
      trailing: false,
    }
  );

  // 使用 addEventListener 就可以实现
  const handlers = [
    on("mousemove", updatePosition, doc),
    on("touchmove", updatePosition, doc),
    on("drag", updatePosition, doc),
  ];
  return () => {
    handlers.forEach((h) => h());
  };
}

function initMutationObserver(options, rootEl) {
  const mutationBuffer = new MutationBuffer(); // 存放本次变化有关的信息
  mutationBuffers.push(mutationBuffer);
  mutationBuffer.init(options);
  const observer = new MutationObserver(
    mutationBuffer.processMutations.bind(mutationBuffer)
  );
  observer.observe(rootEl, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
  });
  return observer;
}

class MutationBuffer {
  constructor() {
    this.frozen = false;
    this.locked = false;
    this.removes = [];
    this.mapRemoves = [];
    this.addedSet = new Set();
    this.movedSet = new Set();
    this.processMutations = (mutations) => {
      mutations.forEach(this.processMutation);
      this.emit();
    };
    this.emit = () => {
      // ...
    };
    this.processMutation = (m) => {
      switch (
        m.type // 判断mutation的类型
      ) {
        case "characterData": {
          // ...
        }
        case "attributes": {
          // ...
        }
        case "childList": {
          m.addedNodes.forEach((n) => this.genAdds(n, m.target));
          m.removedNodes.forEach((n) => {
            const nodeId = this.mirror.getId(n);
            const parentId = isShadowRoot(m.target)
              ? this.mirror.getId(m.target.host)
              : this.mirror.getId(m.target);
            if (
              isBlocked(m.target, this.blockClass, this.blockSelector, false) ||
              isIgnored(n, this.mirror) ||
              !isSerialized(n, this.mirror)
            ) {
              return;
            } else if (this.addedSet.has(m.target) && nodeId === -1);
            else if (isAncestorRemoved(m.target, this.mirror));
            else if (
              this.movedSet.has(n) &&
              this.movedMap[moveKey(nodeId, parentId)]
            ) {
              deepDelete(this.movedSet, n);
            } else {
              this.removes.push({
                parentId,
                id: nodeId,
                isShadow:
                  isShadowRoot(m.target) && isNativeShadowDom(m.target)
                    ? true
                    : undefined,
              });
            }
          });
        }
      }
    };
    this.genAdds = (n, target) => {
      if (this.mirror.hasNode(n)) {
        this.movedSet.add(n);
      } else {
        this.addedSet.add(n);
      }
      if (!isBlocked(n, this.blockClass, this.blockSelector, false))
        n.childNodes.forEach((childN) => this.genAdds(childN));
    };
  }
}

this.emit = () => {
  if (this.frozen || this.locked) {
    return;
  }
  const adds = [];
  // 使用双向链表维护新增的节点
  const addList = new DoubleLinkedList();
  const getNextId = (n) => {
    // 获取nextSibling的ID
  };
  const pushAdd = (n) => {
    if (!n.parentNode) {
      return;
    }
    const parentId = this.mirror.getId(n.parentNode);
    const nextId = getNextId(n);
    if (parentId === -1 || nextId === -1) {
      return addList.addNode(n);
    }
    const sn = serializeNodeWithId(n, {
      // options...
    });
    if (sn) {
      adds.push({
        parentId,
        nextId,
        node: sn,
      });
    }
  };
  for (const n of Array.from(this.movedSet.values())) {
    if (
      isParentRemoved(this.removes, n, this.mirror) &&
      !this.movedSet.has(n.parentNode)
    ) {
      continue;
    }
    pushAdd(n);
  }
  for (const n of Array.from(this.addedSet.values())) {
    if (
      !isAncestorInSet(this.droppedSet, n) &&
      !isParentRemoved(this.removes, n, this.mirror)
    ) {
      pushAdd(n);
    } else if (isAncestorInSet(this.movedSet, n)) {
      pushAdd(n);
    } else {
      this.droppedSet.add(n);
    }
  }
  let candidate = null;
  while (addList.length) {
    let node = null;
    if (candidate) {
      const parentId = this.mirror.getId(candidate.value.parentNode);
      const nextId = getNextId(candidate.value);
      if (parentId !== -1 && nextId !== -1) {
        node = candidate;
      }
    }
    if (!node) {
      for (let index = addList.length - 1; index >= 0; index--) {
        const _node = addList.get(index);
        if (_node) {
          const parentId = this.mirror.getId(_node.value.parentNode);
          const nextId = getNextId(_node.value);
          if (nextId === -1) continue;
          else if (parentId !== -1) {
            node = _node;
            break;
          }
        }
      }
    }
    if (!node) {
      while (addList.head) {
        addList.removeNode(addList.head.value);
      }
      break;
    }
    candidate = node.previous;
    addList.removeNode(node.value);
    pushAdd(node.value);
  }
  const payload = {
    // 省略文本和属性部分代码
    removes: this.removes,
    adds,
  };
  this.mutationCb(payload);
};
